import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import CircularProgress from '@mui/material/CircularProgress';

const ComplaintsList = () => {
  const [userComplaints, setUserComplaints] = useState([]);
  const [staffComplaints, setStaffComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login first', { variant: 'error' });
        return;
      }

      setLoading(true);
      
      console.log('Fetching complaints with token:', token.substring(0, 10) + '...');
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      console.log('Request headers:', headers);
      
      // Fetch both user and staff complaints in parallel
      const [userResponse, staffResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/user-complaints`, {
          headers
        }).catch(error => {
          console.error('Error fetching user complaints:', error.response || error);
          return { data: { success: false, complaints: [] } };
        }),
        axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/staff-complaints`, {
          headers
        }).catch(error => {
          console.error('Error fetching staff complaints:', error.response || error);
          return { data: { success: false, complaints: [] } };
        })
      ]);

      console.log('User complaints response:', userResponse.data);
      console.log('Staff complaints response:', staffResponse.data);

      if (userResponse.data.success) {
        const userComplaintsData = userResponse.data.complaints || [];
        console.log('User complaints data:', userComplaintsData);
        setUserComplaints(userComplaintsData);
      } else {
        console.error('User complaints response not successful:', userResponse.data);
      }

      if (staffResponse.data.success) {
        const staffComplaintsData = staffResponse.data.complaints || [];
        console.log('Staff complaints data:', staffComplaintsData);
        setStaffComplaints(staffComplaintsData);
      } else {
        console.error('Staff complaints response not successful:', staffResponse.data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      enqueueSnackbar(error.response?.data?.message || 'Failed to fetch complaints', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, status, type) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'user' 
        ? `/api/admin/user-complaints/${complaintId}`
        : `/api/admin/staff-complaints/${complaintId}`;

      console.log('Updating status:', { complaintId, status, type, endpoint });

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Status update response:', response.data);

      if (response.data.success) {
        enqueueSnackbar('Status updated successfully', { variant: 'success' });
        fetchComplaints(); // Refresh both lists after update
      }
    } catch (error) {
      console.error('Error updating status:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      enqueueSnackbar(error.response?.data?.message || 'Failed to update status', {
        variant: 'error'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress color="secondary" />
      </div>
    );
  }

  const renderComplaint = (complaint, type) => (
    <div key={complaint._id} className="bg-gray-800 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-pink-400 font-semibold">
            {type === 'user' ? complaint.userId?.name : complaint.staffId?.name} 
            ({type === 'user' ? complaint.userId?.email : complaint.staffId?.email})
          </p>
          {type === 'user' && (
            <>
              <p className="text-gray-300 mt-1">Subject: {complaint.subject}</p>
              <p className="text-gray-300">Category: {complaint.category}</p>
            </>
          )}
          {type === 'staff' && (
            <p className="text-gray-300 mt-1">Department: {complaint.department}</p>
          )}
          <p className="text-white mt-2">{complaint.description}</p>
          <div className="mt-2 space-x-4">
            <span className="text-gray-400">Priority: 
              <span className={`ml-1 ${
                complaint.priority === 'high' ? 'text-red-400' :
                complaint.priority === 'medium' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {complaint.priority}
              </span>
            </span>
            <span className="text-gray-400">Status: 
              <span className={`ml-1 ${
                complaint.status === 'pending' ? 'text-yellow-400' :
                complaint.status === 'resolved' ? 'text-green-400' :
                complaint.status === 'rejected' ? 'text-red-400' :
                'text-blue-400'
              }`}>
                {complaint.status}
              </span>
            </span>
            <span className="text-gray-400">
              Date: {new Date(complaint.createdAt).toLocaleString()}
            </span>
          </div>
          {complaint.response && (
            <div className="mt-2">
              <p className="text-gray-400">Response: <span className="text-white">{complaint.response}</span></p>
            </div>
          )}
          {complaint.resolvedBy && (
            <div className="mt-1">
              <p className="text-gray-400">Resolved by: <span className="text-white">{complaint.resolvedBy.name}</span></p>
              <p className="text-gray-400">Resolved at: <span className="text-white">{new Date(complaint.resolvedAt).toLocaleString()}</span></p>
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleStatusUpdate(complaint._id, 'resolved', type)}
            className={`px-3 py-1 ${complaint.status === 'resolved' ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white rounded`}
            disabled={complaint.status === 'resolved'}
          >
            Resolve
          </button>
          <button
            onClick={() => handleStatusUpdate(complaint._id, 'rejected', type)}
            className={`px-3 py-1 ${complaint.status === 'rejected' ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'} text-white rounded`}
            disabled={complaint.status === 'rejected'}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-pink-500 mb-4">Staff Complaints</h2>
        {staffComplaints.length === 0 ? (
          <p className="text-gray-400 text-center">No staff complaints</p>
        ) : (
          staffComplaints.map(complaint => renderComplaint(complaint, 'staff'))
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-pink-500 mb-4">User Complaints</h2>
        {userComplaints.length === 0 ? (
          <p className="text-gray-400 text-center">No user complaints</p>
        ) : (
          userComplaints.map(complaint => renderComplaint(complaint, 'user'))
        )}
      </div>
    </div>
  );
};

export default ComplaintsList;
