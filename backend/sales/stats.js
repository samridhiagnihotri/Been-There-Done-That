  const express = require("express");
const router = express.Router();
const Sales = require("../models/salesModel"); // Assuming you have a Sales model in MongoDB

// Get sales stats
router.get("/stats", async (req, res) => {
  try {
    const totalSales = await Sales.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalOrders = await Sales.countDocuments();
    const totalRevenue = totalSales[0]?.total || 0;
    const bestSellingProduct = await Sales.aggregate([
      { $group: { _id: "$product", total: { $sum: "$quantity" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    const averageOrderValue = totalRevenue / totalOrders;

    res.status(200).json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalRevenue,
      bestSellingProduct: bestSellingProduct[0]?._id || "No sales yet",
      averageOrderValue: isNaN(averageOrderValue) ? 0 : averageOrderValue,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get sales stats", error: err });
  }
});

module.exports = router;
