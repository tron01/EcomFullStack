const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;
    const userId = req.user._id; // Assumes authentication middleware sets req.user

    // Create order items
    const orderItemIds = [];
    for (const item of items) {
      const orderItem = await OrderItem.create({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      });
      orderItemIds.push(orderItem._id);
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: orderItemIds,
      shippingAddress,
      paymentMethod, // Should be a PaymentMethod ObjectId
      totalAmount,
    });

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user')
      .populate('paymentMethod')
      .populate({
        path: 'items',
        populate: { path: 'product' }
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user')
      .populate('paymentMethod')
      .populate({
        path: 'items',
        populate: { path: 'product' }
      });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user').populate('paymentMethod').populate({
      path: 'items',
      populate: { path: 'product' }
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user order by ID
exports.getUserOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
      .populate('paymentMethod')
      .populate({
        path: 'items',
        populate: { path: 'product' }
      });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders for the current user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('paymentMethod')
      .populate({
        path: 'items',
        populate: { path: 'product' }
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Allow user to cancel their order
exports.cancelUserOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'cancelled' },
      { new: true }
    )
      .populate('paymentMethod')
      .populate({
        path: 'items',
        populate: { path: 'product' }
      });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
