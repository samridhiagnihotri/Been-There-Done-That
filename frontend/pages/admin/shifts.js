import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosConfig';
import { useSnackbar } from 'notistack';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminDrawer from '../../components/admin/AdminDrawer';
import ShiftManagement from '../../components/admin/ShiftManagement';
import Router from 'next/router';

const AdminShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) {
      Router.push('/login');
    } else if (user.role !== 'admin') {
      Router.push('/');
    }
  }, [user]);

  const fetchShifts = async () => {
    try {
      const response = await axiosInstance.get('/api/shifts');
      setShifts(response.data.shifts);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch shifts', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
        <AdminSidebar />
        <div className="flex-grow min-w-fit ml-5">
          <ShiftManagement shifts={shifts} fetchShifts={fetchShifts} />
        </div>
      </div>

      {/* Mobile View */}
      <div className="min-h-[83vh] p-3 md:hidden">
        <div className="flex flex-col">
          <AdminDrawer />
          <div className="mt-3">
            <ShiftManagement shifts={shifts} fetchShifts={fetchShifts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminShifts;
