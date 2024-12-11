import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { Add as AddIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminCouponForm from '../../components/admin/AdminCouponForm';
import AdminSidebar from '../../components/admin/AdminSidebar';

const CouponManagement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [coupons, setCoupons] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/coupons`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCoupons(response.data.coupons);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      enqueueSnackbar('Failed to fetch coupons', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteCoupon = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/coupons/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        enqueueSnackbar('Coupon deleted successfully', { variant: 'success' });
        fetchCoupons();
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      enqueueSnackbar('Failed to delete coupon', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            <AdminSidebar />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-pink-500">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-pink-500">Coupon Management</h1>
              <button
                onClick={() => setOpenDialog(true)}
                className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                <AddIcon /> Create Coupon
              </button>
            </div>

            {/* Coupons Grid */}
            {coupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coupons.map((coupon) => (
                  <div key={coupon._id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{coupon.code}</h3>
                        <p className="text-gray-400">{coupon.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        coupon.isActive ? 'bg-green-500' : 'bg-red-500'
                      } text-white`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="font-medium text-pink-400">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}%`
                            : `₹${coupon.discountValue}`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Min. Order:</span>
                        <span>
                          {coupon.minOrderAmount > 0 ? `₹${coupon.minOrderAmount}` : '-'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Usage:</span>
                        <span>
                          {coupon.usedCount || 0}/{coupon.usageLimit || '∞'}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Expires:</span>
                        <span>{new Date(coupon.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <button
                        onClick={() => handleDeleteCoupon(coupon._id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <DeleteIcon /> Delete Coupon
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No coupons found</p>
                <button
                  onClick={() => setOpenDialog(true)}
                  className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Create Your First Coupon
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Coupon Dialog */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg w-full max-w-2xl">
              <AdminCouponForm
                onSuccess={() => {
                  setOpenDialog(false);
                  fetchCoupons();
                }}
                onCancel={() => setOpenDialog(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;