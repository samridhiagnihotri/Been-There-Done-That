import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';
import StaffSidebar from '../../components/staff/StaffSidebar';
import StaffDrawer from '../../components/staff/StaffDrawer';
import ComplaintForm from '../../components/staff/ComplaintForm';
import StaffShiftList from '../../components/staff/StaffShiftList';

const StaffDashboard = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    } else if (user.role !== 'staff') {
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        console.log('Fetching staff stats...');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        console.log('Stats response:', response.data);

        if (response.data.success) {
          setStats(response.data.stats);
        } else {
          throw new Error(response.data.message || 'Failed to fetch stats');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        enqueueSnackbar(error.response?.data?.message || 'Failed to fetch stats', {
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router, enqueueSnackbar]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[83vh]">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
        <StaffSidebar />
        <div className="flex-grow min-w-fit ml-5">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-pink-400 mb-8">Staff Dashboard</h1>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-pink-300 text-lg mb-2">Today's Orders</h3>
                <p className="text-white text-2xl font-bold">{stats.todayOrders}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-pink-300 text-lg mb-2">Total Orders</h3>
                <p className="text-white text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-pink-300 text-lg mb-2">Pending Orders</h3>
                <p className="text-yellow-500 text-2xl font-bold">{stats.pendingOrders}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-pink-300 text-lg mb-2">Completed Orders</h3>
                <p className="text-green-500 text-2xl font-bold">{stats.completedOrders}</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-pink-300 text-lg mb-2">Cancelled Orders</h3>
                <p className="text-red-500 text-2xl font-bold">{stats.cancelledOrders}</p>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="w-full max-w-4xl">
              <ComplaintForm />
            </div>

            {/* Shifts Section */}
            <div className="w-full max-w-4xl mt-8">
              <StaffShiftList />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="min-h-[83vh] p-3 md:hidden">
        <div className="flex flex-col">
          <StaffDrawer />
          <div className="flex flex-col items-center mt-16">
            <h1 className="text-xl font-semibold text-pink-400 mb-6">Staff Dashboard</h1>
            <div className="space-y-4 w-full px-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-pink-300">Today's Orders</h3>
                <p className="text-white text-xl font-bold">{stats.todayOrders}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-pink-300">Total Orders</h3>
                <p className="text-white text-xl font-bold">{stats.totalOrders}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-pink-300">Pending Orders</h3>
                <p className="text-yellow-500 text-xl font-bold">{stats.pendingOrders}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-pink-300">Completed Orders</h3>
                <p className="text-green-500 text-xl font-bold">{stats.completedOrders}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-pink-300">Cancelled Orders</h3>
                <p className="text-red-500 text-xl font-bold">{stats.cancelledOrders}</p>
              </div>
            </div>
            <div className="w-full mt-8">
              <ComplaintForm />
            </div>
            <div className="w-full mt-8">
              <StaffShiftList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard; 