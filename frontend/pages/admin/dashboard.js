import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminDrawer from '../../components/admin/AdminDrawer';
import ShiftManagement from '../../components/admin/ShiftManagement';
import { CircularProgress } from '@mui/material';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    orders: {
      total: 0,
      completed: 0,
      pending: 0,
      cancelled: 0
    },
    totalRevenue: 0,
    dailyRevenue: Array(7).fill(0),
    dailyOrders: Array(7).fill(0)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        console.log('Fetching stats...');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/stats`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log('Raw API response:', response.data);

        if (response.data.success) {
          const rawStats = response.data.stats;
          
          // Ensure numbers are properly formatted
          const processedStats = {
            orders: {
              total: Number(rawStats.orders.total || 0),
              completed: Number(rawStats.orders.completed || 0),
              pending: Number(rawStats.orders.pending || 0),
              cancelled: Number(rawStats.orders.cancelled || 0)
            },
            totalRevenue: Number(rawStats.totalRevenue || 0),
            dailyRevenue: (rawStats.dailyRevenue || []).map(rev => Number(rev || 0)),
            dailyOrders: (rawStats.dailyOrders || []).map(ord => Number(ord || 0))
          };

          console.log('Processed stats:', processedStats);
          setStats(processedStats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'dashboard') {
      fetchStats();
    }
  }, [router, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'shifts':
        return <ShiftManagement />;
      default:
        return (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Card */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Total Revenue</h2>
              <p className="text-3xl font-bold text-green-500">
                ₹{typeof stats.totalRevenue === 'object' 
                  ? (stats.totalRevenue.amount || 0).toLocaleString('en-IN')
                  : (stats.totalRevenue || 0).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Orders Card */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Orders Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.orders?.total || stats.orderCount?.total || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-green-500">
                    {stats.orders?.completed || stats.orderCount?.completed || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {stats.orders?.pending || stats.orderCount?.pending || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Cancelled</p>
                  <p className="text-2xl font-bold text-red-500">
                    {stats.orders?.cancelled || stats.orderCount?.cancelled || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Stats */}
            <div className="bg-gray-800 rounded-lg p-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">Daily Statistics</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="text-left pb-3">Day</th>
                      <th className="text-right pb-3">Orders</th>
                      <th className="text-right pb-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.dailyRevenue?.map((day, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="py-2">
                          {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000)
                            .toLocaleDateString('en-US', { weekday: 'short' })}
                        </td>
                        <td className="text-right">
                          {stats.dailyOrders?.[index] || 0}
                        </td>
                        <td className="text-right text-green-500">
                          ₹{(typeof day === 'object' ? day.amount : day || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Desktop View */}
      <div className="hidden md:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-grow min-w-fit ml-5">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-pink-400 mb-6">
              {activeTab === 'dashboard' ? 'DASHBOARD' : 
               activeTab === 'shifts' ? 'STAFF SHIFTS' : ''}
            </h1>
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden min-h-[83vh] p-3">
        <AdminDrawer activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-3">
          <h1 className="text-2xl font-semibold text-pink-400 text-center mb-6">
            {activeTab === 'dashboard' ? 'DASHBOARD' : 
             activeTab === 'shifts' ? 'STAFF SHIFTS' : ''}
          </h1>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

