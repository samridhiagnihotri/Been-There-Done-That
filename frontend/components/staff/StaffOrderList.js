import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { CheckCircle } from '@mui/icons-material';

const StaffOrderList = ({ item, allOrders, setAllOrders }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleComplete = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/orders/${item._id}`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Remove the completed order from the list immediately
        setAllOrders(current => current.filter(order => order._id !== item._id));
        enqueueSnackbar('Order marked as completed', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error completing order:', error);
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update order',
        { variant: 'error' }
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-600 w-[18rem] md:w-[20rem] lg:w-[25rem] rounded-xl mb-3">
      <div className="flex justify-between">
        <h1 className="text-pink-100 font-semibold">{item.name}</h1>
        <h1 className="text-pink-100 font-semibold">{item.email}</h1>
      </div>
      <div className="text-pink-100">
        <h2 className="font-semibold">Ordered Items:</h2>
        <ul>
          {item.items?.map((orderItem, index) => (
            <li key={index} className="flex justify-between items-center py-1">
              <span>{orderItem.name}</span>
              <span className="text-sm">×{orderItem.quantity}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm">
          Total Amount: {item.formattedAmount}
        </p>
        <p className="text-xs text-gray-300">
          Ordered: {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="mt-2">
        <button
          onClick={handleComplete}
          disabled={isUpdating}
          className={`flex items-center justify-center w-full py-2 rounded-lg 
            ${isUpdating 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-pink-500 hover:bg-pink-600'} 
            text-white transition-colors`}
        >
          {isUpdating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            'Mark as Completed'
          )}
        </button>
      </div>
    </div>
  );
};

export default StaffOrderList;
