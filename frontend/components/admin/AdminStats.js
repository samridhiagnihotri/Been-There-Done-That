import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stats`,
        {
          headers: { 
            Authorization: `Bearer ${token}` 
          }
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-pink-400">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const chartData = {
    labels: stats?.weeklySales.map(sale => sale._id) || [],
    datasets: [
      {
        label: 'Daily Revenue (₹)',
        data: stats?.weeklySales.map(sale => sale.total) || [],
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.5)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Revenue Stats */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-pink-400 mb-6">Monthly Overview</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-pink-100 text-sm">Revenue</p>
            <p className="text-2xl font-bold text-pink-400">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(stats?.monthlyStats.totalRevenue)}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-pink-100 text-sm">Orders</p>
            <p className="text-2xl font-bold text-pink-400">
              {stats?.monthlyStats.totalOrders}
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-pink-100 text-sm">Avg. Order</p>
            <p className="text-2xl font-bold text-pink-400">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(stats?.monthlyStats.averageOrderValue)}
            </p>
          </div>
        </div>
        <div className="h-64">
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#f9a8d4'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: '#f9a8d4'
                  }
                }
              },
              plugins: {
                legend: {
                  labels: {
                    color: '#f9a8d4'
                  }
                }
              },
              // Adding title and description for accessibility
              title: {
                display: true,
                text: 'Weekly Sales Revenue',
                color: '#f9a8d4'
              },
              description: {
                display: true,
                text: 'This graph shows the daily revenue for the current week.'
              }
            }}
          />
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-pink-400 mb-6">Top Selling Items</h2>
        <div className="space-y-4">
          {stats?.topItems.map((item, index) => (
            <div key={item._id} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl text-pink-400 font-bold">#{index + 1}</span>
                <div>
                  <p className="text-pink-100 font-semibold">{item.name}</p>
                  <p className="text-sm text-pink-300">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0
                    }).format(item.revenue)}
                  </p>
                </div>
              </div>
              <div className="text-pink-400 font-bold">
                {item.totalQuantity} sold
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
