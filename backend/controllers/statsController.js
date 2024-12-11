const Sales = require('../models/salesModel');

const statsController = {
  getDashboardStats: async (req, res) => {
    try {
      const matchCondition = { status: 'completed' };
      
      const monthlyStats = await Sales.aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: "$totalAmount" }
          }
        },
        {
          $project: {
            _id: 0,
            totalRevenue: { $round: ["$totalRevenue", 2] },
            totalOrders: 1,
            averageOrderValue: { $round: ["$averageOrderValue", 2] }
          }
        }
      ]);

      res.status(200).json({
        monthlyStats: monthlyStats[0] || {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0
        }
      });
    } catch (error) {
      console.error('Stats Error:', error.stack);
      res.status(500).json({ message: "Error fetching statistics" });
    }
  }
};

module.exports = statsController;
