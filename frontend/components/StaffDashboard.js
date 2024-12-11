import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const StaffDashboard: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [updating, setUpdating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to fetch orders', 
        { variant: 'error' }
      );
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
        // Refresh orders list
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update order status', 
        { variant: 'error' }
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      {orders.map(order => (
        <div key={order._id}>
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
            className="p-2 rounded bg-gray-700 text-white border border-gray-600"
            disabled={updating}
          >
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default StaffDashboard; 