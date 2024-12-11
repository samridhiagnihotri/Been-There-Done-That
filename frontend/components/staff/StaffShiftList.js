import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import CircularProgress from '@mui/material/CircularProgress';

const StaffShiftList = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/shifts`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.data.success) {
          setShifts(response.data.shifts || []);
        } else {
          throw new Error(response.data.message || 'Failed to fetch shifts');
        }
      } catch (error) {
        // Only show error for actual errors, not for empty shifts
        if (!error.response?.data?.success) {
          enqueueSnackbar(error.response?.data?.message || 'Failed to fetch shifts', {
            variant: 'error'
          });
        }
        setShifts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [enqueueSnackbar]);

  if (loading) {
    return <CircularProgress color="secondary" />;
  }

  return (
    <div className="w-full max-w-4xl mt-8">
      <h2 className="text-xl font-semibold text-pink-400 mb-4">My Shifts</h2>
      <div className="space-y-4">
        {shifts.map((shift) => (
          <div key={shift._id} className="bg-gray-800 p-4 rounded-lg">
            <div className="text-pink-300 font-semibold">
              {new Date(shift.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="text-white mt-2">
              Time: {shift.startTime} - {shift.endTime}
            </div>
            <div className="text-white">
              Status: <span className="capitalize text-pink-200">{shift.status}</span>
            </div>
          </div>
        ))}
        {shifts.length === 0 && (
          <div className="text-gray-400 text-center">No shifts assigned yet</div>
        )}
      </div>
    </div>
  );
};

export default StaffShiftList;
