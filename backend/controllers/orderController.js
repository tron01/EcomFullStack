const Order = require('../models/Order');

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'user',
        select:'name'
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get order by ID (admin)
exports.getOrderDetailsById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate({
        path:'user',
        select:'name'
      })
      .populate({
        path:'paymentMethod',
        select: 'name'
      })
      .populate({
        path: 'items',
        populate:{ 
            path: 'product',
            select : 'name thumbnail',
              populate : {
                 path : 'thumbnail',
                 select : 'url'
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

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  
  try {  
    
    const OrderStatus = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    const { status } = req.body;

    if (!OrderStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id,{ status },{ new: true , runValidators: true })
      .populate({
        path:'user',
        select:'name'
      })
      .populate({
        path:'paymentMethod',
        select: 'name'
      })
      .populate({
        path: 'items',
        populate:{ 
            path: 'product',
            select : 'name thumbnail',
              populate : {
                 path : 'thumbnail',
                 select : 'url'
              } 
           }
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
        path:'user',
        select:'name'
      }) 
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
      path:'user',
      select:'name'
    })
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
    // Step 1: Find the order first
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    // Step 2: Check if order exists
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Step 3: Allow cancellation only if status is 'pending' or 'confirmed'
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled in '${order.status}' state`
      });
    }

    // Step 4: Update the order status to 'cancelled'
    order.status = 'cancelled';
    await order.save();

    // Step 5: Populate related fields
    await order.populate([{
       path: 'paymentMethod', 
       select: 'name' },
       {
         path: 'items',
         populate: {
            path: 'product',
            select: 'name thumbnail',
              populate: { 
                path: 'thumbnail', 
                select: 'url' 
              }
            }
        }]);

    // Step 6: Send response
    res.json({ message: 'Order cancelled', order });
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

