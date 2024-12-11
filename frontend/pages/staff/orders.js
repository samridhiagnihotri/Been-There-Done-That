import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';
import StaffOrderList from '../../components/staff/StaffOrderList';
import StaffSidebar from '../../components/staff/StaffSidebar';
import StaffDrawer from '../../components/staff/StaffDrawer';

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        router.push('/login');
        return;
      }

      console.log('Starting API call:', {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
        endpoint: '/api/staff/orders',
        hasToken: !!token
      });

      const response = await axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/orders`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response received:', {
        status: response.status,
        data: response.data
      });

      if (response.data.success) {
        setOrders(response.data.orders);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }

    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      let errorMessage = 'Failed to fetch orders';
      if (!error.response) {
        errorMessage = 'Cannot connect to server. Please check if server is running.';
      } else if (error.response.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        router.push('/login');
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, router]);

  useEffect(() => {
    console.log('Initial fetch...');
    fetchOrders();

    const interval = setInterval(() => {
      console.log('Auto-refresh...');
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="hidden md:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
        <StaffSidebar />
        <div className="flex-grow min-w-fit ml-5">
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-semibold text-pink-400 mb-4">ORDERS</h1>
            <div className="w-full">
              {error ? (
                <div className="text-center text-white">
                  <p className="text-xl mb-4">{error}</p>
                  <button
                    onClick={fetchOrders}
                    className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded"
                  >
                    Retry
                  </button>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center text-white text-xl mt-10">
                  No pending orders at the moment
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {orders.map((order) => (
                    <StaffOrderList
                      key={order._id}
                      item={order}
                      allOrders={orders}
                      setAllOrders={setOrders}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-[83vh] p-3 md:hidden">
        <div className="flex flex-col">
          <StaffDrawer />
          <div className="flex flex-col justify-center items-center mt-3">
            <h1 className="text-lg font-semibold text-pink-400 mb-3">ORDERS</h1>
            {error ? (
              <div className="text-center text-white">
                <p className="text-xl mb-4">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded"
                >
                  Retry
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center text-white text-xl mt-10">
                No pending orders at the moment
              </div>
            ) : (
              <div className="w-full space-y-4">
                {orders.map((order) => (
                  <StaffOrderList
                    key={order._id}
                    item={order}
                    allOrders={orders}
                    setAllOrders={setOrders}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOrders;
