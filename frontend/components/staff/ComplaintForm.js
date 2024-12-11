import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const ComplaintForm = () => {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    description: '',
    priority: 'low',
    department: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to submit complaints');
      }

      console.log('Submitting staff complaint:', {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/complaints`,
        data: formData,
        hasToken: !!token
      });

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/staff/complaints`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        enqueueSnackbar('Complaint submitted successfully', { variant: 'success' });
        setFormData({
          description: '',
          priority: 'low',
          department: ''
        });
      } else {
        throw new Error(response.data.message || 'Failed to submit complaint');
      }
    } catch (error) {
      console.error('Complaint submission error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      let errorMessage = 'Failed to submit complaint';
      if (error.response?.status === 401) {
        errorMessage = 'Please login again to continue';
      } else if (error.response?.status === 403) {
        errorMessage = 'You are not authorized to submit complaints';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="w-full max-w-4xl mt-8">
      <h2 className="text-xl font-semibold text-pink-400 mb-4">Submit Staff Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select Department</option>
            <option value="kitchen">Kitchen</option>
            <option value="service">Service</option>
            <option value="management">Management</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-pink-500 min-h-[100px]"
            placeholder="Describe your complaint..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <CircularProgress size={20} color="inherit" className="mr-2" />
              Submitting...
            </>
          ) : (
            'Submit Complaint'
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
