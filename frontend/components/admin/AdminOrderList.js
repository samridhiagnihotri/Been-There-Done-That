import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { Delete, CheckCircle, Cancel, Pending } from '@mui/icons-material';
import { MenuItem, Select } from '@mui/material';

const AdminOrderList = ({ item, allOrders, setAllOrders }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(item.status);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Test server connection first
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
      console.log('Testing connection to:', baseUrl);

      // Simple test request
      const testResponse = await axios.get(`${baseUrl}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Server is reachable:', testResponse.status);

      // If we get here, server is reachable, proceed with update
      const updateResponse = await axios.patch(
        `${baseUrl}/api/admin/orders/${item._id}`,
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (updateResponse.data.success) {
        setCurrentStatus(newStatus);
        const updatedOrders = allOrders.map(order => 
          order._id === item._id ? { ...order, status: newStatus } : order
        );
        setAllOrders(updatedOrders);
        enqueueSnackbar('Order status updated successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Connection test failed:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (!error.response) {
        enqueueSnackbar('Cannot connect to server. Please check if the server is running.', {
          variant: 'error'
        });
      } else {
        enqueueSnackbar(error.response.data?.message || 'Failed to update order status', {
          variant: 'error'
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      {/* Order Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-white font-semibold text-lg">{item.name}</h3>
          <p className="text-gray-300">{item.email}</p>
          <p className={`text-sm ${
            currentStatus === 'completed' ? 'text-green-500' : 
            currentStatus === 'cancelled' ? 'text-red-500' : 
            'text-yellow-500'
          }`}>
            Current Status: {currentStatus.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="bg-gray-600 text-white min-w-[120px]"
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.23)',
              },
              '.MuiSvgIcon-root': {
                color: 'white',
              },
            }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
          {isUpdating && (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-pink-500"></div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-4">
        <h4 className="text-white font-medium mb-2">Order Items:</h4>
        <div className="space-y-2">
          {item.items && item.items.map((orderItem, index) => (
            <div key={index} className="flex justify-between text-gray-300">
              <span>{orderItem.name}</span>
              <span>×{orderItem.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Footer */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-gray-300">
          <p>Order Date: {new Date(item.createdAt).toLocaleDateString()}</p>
          <p className="font-medium text-white">
            Total Amount: ₹{item.totalAmount}
          </p>
        </div>
        <div className={`font-medium ${getStatusColor(currentStatus)}`}>
          {currentStatus.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderList;
