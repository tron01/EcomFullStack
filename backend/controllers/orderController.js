const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');


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

// Get order by ID (admin)
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
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
       .populate({
        path: 'paymentMethod',
        select: 'name'
      })
      .populate({
        path: 'items',
        populate: {
          path: 'product',
          select: 'name thumbnail',
          populate: {
            path: 'thumbnail',
            select: 'url'
          }
        }
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
    const orders = await Order.find({ user: req.user.id })
    .populate({
        path: 'paymentMethod',
        select: 'name' // only get the 'name' field
      })
      .populate({
        path: 'items',
          populate: {
            path: 'product',
              select: 'name thumbnail',// only these fields will be returned
                  populate: {
                    path: 'thumbnail',
                      select: 'url' // only get image URL from thumbnail
                  }
          }
       }
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Allow user to cancel their order
exports.cancelUserOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate({ _id: req.params.id,
       user: req.user.id },{ status: 'cancelled' },{ new: true })
       
      .populate({
        path: 'paymentMethod',
        select: 'name' // only get the 'name' field
      })
      .populate({
        path: 'items',
          populate: {
            path: 'product',
              select: 'name thumbnail',// only these fields will be returned
                  populate: {
                    path: 'thumbnail',
                      select: 'url' // only get image URL from thumbnail
                  }
          }
       }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
