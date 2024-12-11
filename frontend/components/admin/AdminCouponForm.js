import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const AdminCouponForm = ({ onSuccess, onCancel }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '0',
    usageLimit: null,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    isActive: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.code || !formData.name || !formData.discountValue || !formData.expiryDate) {
        enqueueSnackbar('Please fill all required fields', { variant: 'error' });
        setLoading(false);
        return;
      }

      // Validate discount value
      if (formData.discountType === 'percentage' && (formData.discountValue < 0 || formData.discountValue > 100)) {
        enqueueSnackbar('Percentage discount must be between 0 and 100', { variant: 'error' });
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      
      // Format data before sending
      const submissionData = {
        code: formData.code.toUpperCase().trim(),
        name: formData.name.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        expiryDate: formData.expiryDate,
        isActive: formData.isActive
      };

      console.log('Submitting coupon data:', submissionData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/coupons`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        enqueueSnackbar('Coupon created successfully!', { variant: 'success' });
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      const errorMessage = error.response?.data?.message || 
        (error.response?.data?.error?.message) || 
        'Failed to create coupon. Please check all required fields.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-pink-500 mb-6">Create New Coupon</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coupon Code */}
        <div>
          <label className="block text-gray-300 mb-2">Coupon Code*</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              code: e.target.value.toUpperCase() 
            }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="e.g., WELCOME50"
            required
            minLength={3}
            maxLength={15}
          />
        </div>

        {/* Coupon Name */}
        <div>
          <label className="block text-gray-300 mb-2">Coupon Name*</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="e.g., Welcome Discount"
            required
            minLength={3}
          />
        </div>

        {/* Discount Type */}
        <div>
          <label className="block text-gray-300 mb-2">Discount Type*</label>
          <select
            value={formData.discountType}
            onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
          >
            <option value="percentage">Percentage Off</option>
            <option value="fixed">Fixed Amount Off</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-gray-300 mb-2">
            Discount Value* {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
          </label>
          <input
            type="number"
            value={formData.discountValue}
            onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder={formData.discountType === 'percentage' ? "e.g., 10" : "e.g., 100"}
            min="0"
            max={formData.discountType === 'percentage' ? "100" : ""}
            required
            step="any"
          />
        </div>

        {/* Minimum Order Amount */}
        <div>
          <label className="block text-gray-300 mb-2">Minimum Order Amount (₹)</label>
          <input
            type="number"
            value={formData.minOrderAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="0 for no minimum"
            min="0"
            step="any"
          />
        </div>

        {/* Usage Limit */}
        <div>
          <label className="block text-gray-300 mb-2">Usage Limit</label>
          <input
            type="number"
            value={formData.usageLimit || ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              usageLimit: e.target.value ? Number(e.target.value) : null 
            }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="Leave empty for unlimited"
            min="1"
          />
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-gray-300 mb-2">Expiry Date*</label>
          <input
            type="datetime-local"
            value={formData.expiryDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            required
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="w-4 h-4 text-pink-500 border-gray-600 rounded focus:ring-pink-500"
          />
          <label className="text-gray-300">Active</label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </div>
    </form>
  );
};

export default AdminCouponForm; 