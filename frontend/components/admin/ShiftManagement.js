import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newShift, setNewShift] = useState({
    staffEmail: '',
    date: '',
    startTime: '',
    endTime: ''
  });
  const { enqueueSnackbar } = useSnackbar();

  // Fetch all shifts
  const fetchShifts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login to continue', { variant: 'error' });
        return;
      }

      console.log('Fetching shifts...');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/shifts/all`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Shifts response:', response.data);

      if (response.data.success) {
        setShifts(response.data.shifts || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch shifts');
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
      // Only show error message if it's not a successful response with empty shifts
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

  // Fetch staff list
  const fetchStaffList = async () => {
    try {
      setStaffLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login to continue', { variant: 'error' });
        return;
      }

      console.log('Fetching staff list...');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/staff`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Staff list response:', response.data);

      if (response.data.success) {
        setStaffList(response.data.staff || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch staff list');
      }
    } catch (error) {
      console.error('Error fetching staff list:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch staff list', { 
        variant: 'error' 
      });
      setStaffList([]);
    } finally {
      setStaffLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
    fetchStaffList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShift(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login to continue', { variant: 'error' });
        return;
      }

      // Validate inputs
      if (!newShift.staffEmail || !newShift.date || !newShift.startTime || !newShift.endTime) {
        enqueueSnackbar('Please fill in all fields', { variant: 'error' });
        return;
      }

      console.log('Creating new shift:', newShift);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/shifts`,
        newShift,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Create shift response:', response.data);

      if (response.data.success) {
        enqueueSnackbar('Shift created successfully', { variant: 'success' });
        setNewShift({
          staffEmail: '',
          date: '',
          startTime: '',
          endTime: ''
        });
        fetchShifts();
      } else {
        throw new Error(response.data.message || 'Failed to create shift');
      }
    } catch (error) {
      console.error('Error creating shift:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to create shift', { 
        variant: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login to continue', { variant: 'error' });
        return;
      }

      console.log('Deleting shift:', shiftId);
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/shifts/${shiftId}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Delete shift response:', response.data);

      if (response.data.success) {
        enqueueSnackbar('Shift deleted successfully', { variant: 'success' });
        fetchShifts();
      } else {
        throw new Error(response.data.message || 'Failed to delete shift');
      }
    } catch (error) {
      console.error('Error deleting shift:', error);
      enqueueSnackbar(error.response?.data?.message || 'Failed to delete shift', { 
        variant: 'error' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Shift Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-pink-500 mb-4">Add New Shift</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Staff Member</label>
            {staffLoading ? (
              <div className="w-full p-2 bg-gray-700 rounded-lg">
                <div className="animate-pulse h-6 bg-gray-600 rounded"></div>
              </div>
            ) : (
              <select
                name="staffEmail"
                value={newShift.staffEmail}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500"
                disabled={submitting}
              >
                <option value="">Select Staff Member</option>
                {staffList.map(staff => (
                  <option key={staff._id} value={staff.email}>
                    {staff.name} ({staff.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={newShift.date}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500"
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={newShift.startTime}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={newShift.endTime}
                onChange={handleInputChange}
                required
                className="w-full p-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-pink-500"
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || staffLoading}
            className={`w-full bg-pink-500 text-white py-2 px-4 rounded-lg transition-colors ${
              submitting || staffLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-pink-600'
            }`}
          >
            {submitting ? 'Adding Shift...' : 'Add Shift'}
          </button>
        </form>
      </div>

      {/* Shifts List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-pink-500 mb-4">Current Shifts</h2>
        {shifts.length === 0 ? (
          <p className="text-gray-400 text-center">No shifts scheduled</p>
        ) : (
          <div className="space-y-4">
            {shifts.map((shift) => (
              <div key={shift._id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-white font-semibold">
                    {shift.staffId?.name || 'Unknown Staff'}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {new Date(shift.date).toLocaleDateString()} | {shift.startTime} - {shift.endTime}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteShift(shift._id)}
                  className="text-red-400 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftManagement;
