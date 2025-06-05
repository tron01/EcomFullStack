const mongoose = require('mongoose');
const { stripe } = require('../config/config');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const PaymentMethod = require('../models/PaymentMethod');
const Transaction = require('../models/Transaction'); 

exports.checkout = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userId = req.user.id;
    const { shippingAddress, paymentMethod: methodName } = req.body;

    // 1. Verify payment method is allowed
    const method = await PaymentMethod.findOne({ name: methodName, isActive: true });
    if (!method) return res.status(400).json({ message: 'Unsupported payment method' });

    // 2. Pull and validate cart
    const cart = await Cart.findOne({ user: userId })
                           .populate('items.product')
                           .session(session);
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: 'Cart is empty' });

    // 3. Build order items & update stock
    const orderItemIds = [];
    for (const item of cart.items) {
      if (item.product.stock < item.quantity)
        throw new Error(`Insufficient stock for ${item.product.name}`);

      await Product.findByIdAndUpdate(item.product._id,
        { $inc: { stock: -item.quantity } }, { session });

      const orderItem = await new OrderItem({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
      }).save({ session });

      orderItemIds.push(orderItem._id);
    }

    // 4. Create order shell
    const order = await new Order({
      user: userId,
      items: orderItemIds,
      shippingAddress,
      paymentMethod: method._id,
      totalAmount: cart.totalPrice,
      status: 'pending',
      paymentStatus: 'initiated',
    }).save({ session });

    // 5. Payment-specific flow
    let paymentPayload = {};
    let transaction = null;

    switch (method.name.toLowerCase()) {
      case 'credit card': // Stripe
        const amount = Math.round(cart.totalPrice * 100); // cents
        const intent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
          metadata: { orderId: order._id.toString(), userId },
        });

        // Create transaction record
        transaction = await new Transaction({
          order: order._id,
          user: userId,
          paymentMethod: method._id,
          provider: 'stripe',
          providerTransactionId: intent.id,
          amount: cart.totalPrice,
          currency: 'usd',
          status: 'pending',
          responseData: intent,
        }).save({ session });

        order.transactionId = intent.id;
        order.paymentStatus = 'pending';
        order.latestTransaction = transaction._id;
        paymentPayload = { clientSecret: intent.client_secret };
        break;

      case 'paypal':
        // TODO: call PayPal Orders API and create Transaction
        // const paypalOrder = await createPayPalOrder(amount, order._id);
        // transaction = await new Transaction({...});
        // order.transactionId = paypalOrder.id;
        // order.paymentStatus = 'pending';
        // order.latestTransaction = transaction._id;
        // paymentPayload = { paypalOrderId: paypalOrder.id, approveUrl: paypalOrder.links[1].href };
        break;

      case 'cash on delivery':
      case 'cod':
        order.paymentStatus = 'pending';
        // Optionally create a Transaction for COD as well
        transaction = await new Transaction({
          order: order._id,
          user: userId,
          paymentMethod: method._id,
          provider: 'cod',
          amount: cart.totalPrice,
          currency: 'usd',
          status: 'pending',
        }).save({ session });
        order.latestTransaction = transaction._id;
        break;

      default:
        throw new Error('Unrecognised payment method branch');
    }

    await order.save({ session });
    await Cart.deleteOne({ user: userId }).session(session);

    await session.commitTransaction();
    res.status(201).json({ message: 'Order placed', order, ...paymentPayload });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: 'Checkout failed', error: err.message });
  } finally {
    session.endSession();
  }
};
