import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      enqueueSnackbar('Failed to fetch orders', { variant: 'error' });
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        enqueueSnackbar('Order status updated successfully', { variant: 'success' });
        fetchOrders(); // Refresh the orders list
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      enqueueSnackbar('Failed to update order status', { variant: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-pink-500 mb-6">Order Management</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-white font-medium">Order #{order._id.slice(-6)}</h3>
                <p className="text-gray-400">Customer: {order.name}</p>
                <p className="text-gray-400">Total: ₹{order.totalAmount}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                className={`p-2 rounded ${
                  updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } bg-gray-700 text-white border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500`}
                disabled={updating}
              >
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              {order.items?.map((item, index) => (
                <div key={index} className="text-gray-300">
                  {item.name} x {item.quantity}
                </div>
              ))}
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-gray-400">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard; 
