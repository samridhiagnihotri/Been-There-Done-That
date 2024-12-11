import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const StaffComplaintsList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchStaffComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login first', { variant: 'error' });
        return;
      }

      console.log('Fetching staff complaints...');
      console.log('API URL:', `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/staff-complaints`);
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/staff-complaints`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Staff Complaints API response:', response.data);
      
      if (response.data.success) {
        const complaintsData = response.data.complaints || [];
        console.log('Raw complaints data:', complaintsData);
        
        const sanitizedComplaints = complaintsData.map(complaint => ({
          _id: complaint._id,
          status: complaint.status || 'pending',
          description: complaint.description || complaint.message || '',
          createdAt: complaint.createdAt,
          priority: complaint.priority || 'low',
          staffId: {
            name: complaint.staffId?.name || 'Unknown',
            email: complaint.staffId?.email
          }
        }));

        console.log('Sanitized staff complaints:', sanitizedComplaints);
        setComplaints(sanitizedComplaints);
      } else {
        throw new Error(response.data.message || 'Failed to fetch staff complaints');
      }
    } catch (error) {
      console.error('Error fetching staff complaints:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        enqueueSnackbar('Please login again', { variant: 'error' });
        // Handle unauthorized access
      } else {
        enqueueSnackbar(
          error.response?.data?.message || 'Failed to fetch staff complaints', 
          { variant: 'error' }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffComplaints();
  }, []);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login first', { variant: 'error' });
        return;
      }

      console.log('Updating status:', { complaintId, newStatus });
      
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/staff-complaints/${complaintId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Status update response:', response.data);
      
      if (response.data.success) {
        // Update the local state immediately
        setComplaints(prevComplaints => 
          prevComplaints.map(complaint => 
            complaint._id === complaintId 
              ? { ...complaint, status: newStatus }
              : complaint
          )
        );
        
        enqueueSnackbar('Status updated successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data
      });
      
      enqueueSnackbar(
        error.response?.data?.message || 'Failed to update status', 
        { variant: 'error' }
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-pink-400 mb-4">Staff Complaints</h2>
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="text-gray-400 text-center p-4">No staff complaints found</div>
        ) : (
          complaints.map((complaint) => (
            <div key={complaint._id} className="bg-gray-700 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      complaint.status === 'resolved' ? 'bg-green-500' :
                      complaint.status === 'rejected' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}>
                      {complaint.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${
                      complaint.priority === 'high' ? 'bg-red-500' :
                      complaint.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <select
                    className="bg-gray-600 text-white rounded px-2 py-1 text-sm"
                    value={complaint.status}
                    onChange={(e) => handleStatusUpdate(complaint._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <p className="text-white">{complaint.description}</p>
                <div className="text-sm text-gray-400">
                  <p>Staff Name: {complaint.staffId.name}</p>
                  <p>Department: {complaint.department}</p>
                  <p>Date: {new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffComplaintsList;