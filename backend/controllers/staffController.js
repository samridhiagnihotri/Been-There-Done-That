const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

const staffController = {
  getStats: catchAsync(async (req, res) => {
    console.log('Fetching staff stats...');

    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get orders for today
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    // Get orders by status
    const [pendingOrders, completedOrders, cancelledOrders] = await Promise.all([
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: 'cancelled' })
    ]);

    // Calculate total orders
    const totalOrders = pendingOrders + completedOrders + cancelledOrders;

    const stats = {
      todayOrders,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders
    };

    console.log('Staff stats:', stats);

    res.status(200).json({
      success: true,
      stats
    });
  }),

  getStaffOrders: catchAsync(async (req, res) => {
    console.log('Fetching staff orders...');

    const orders = await Order.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .select('name email items totalAmount status createdAt')
      .lean();

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      name: order.name,
      email: order.email,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      formattedAmount: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(order.totalAmount)
    }));

    console.log(`Found ${orders.length} orders`);

    res.status(200).json({
      success: true,
      orders: formattedOrders
    });
  })
};

module.exports = staffController;
