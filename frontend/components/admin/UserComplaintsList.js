import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

const UserComplaintsList = ({ limit }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching user complaints...');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/user-complaints`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('User complaints response:', response.data);

      if (response.data.success) {
        const sortedComplaints = response.data.complaints.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setComplaints(limit ? sortedComplaints.slice(0, limit) : sortedComplaints);
      } else {
        throw new Error(response.data.message || 'Failed to fetch complaints');
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating complaint status:', { complaintId, newStatus, response });
      
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/user-complaints/${complaintId}`,
        { 
          status: newStatus, 
          response: response 
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setDialogOpen(false);
        setResponse('');
        fetchComplaints();
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating complaint status:', err);
      setError('Failed to update complaint status');
    }
  };

  const handleOpenDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (limit) {
    return (
      <div className="space-y-2">
        {complaints.length === 0 ? (
          <p className="text-gray-400 text-center">No complaints found</p>
        ) : (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium">{complaint.subject}</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    {complaint.description.length > 100
                      ? `${complaint.description.substring(0, 100)}...`
                      : complaint.description}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${complaint.status === 'pending' ? 'bg-yellow-500 text-yellow-900' :
                      complaint.status === 'resolved' ? 'bg-green-500 text-green-900' :
                      'bg-red-500 text-red-900'}`}
                >
                  {complaint.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <TableContainer component={Paper} className="bg-gray-800">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="text-pink-400 font-semibold">Date</TableCell>
              <TableCell className="text-pink-400 font-semibold">User</TableCell>
              <TableCell className="text-pink-400 font-semibold">Subject</TableCell>
              <TableCell className="text-pink-400 font-semibold">Description</TableCell>
              <TableCell className="text-pink-400 font-semibold">Status</TableCell>
              <TableCell className="text-pink-400 font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint._id}>
                <TableCell className="text-white">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-white">
                  {complaint.userId?.name || 'Unknown User'}
                </TableCell>
                <TableCell className="text-white">{complaint.subject}</TableCell>
                <TableCell className="text-white">{complaint.description}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${complaint.status === 'pending' ? 'bg-yellow-500 text-yellow-900' :
                        complaint.status === 'resolved' ? 'bg-green-500 text-green-900' :
                        'bg-red-500 text-red-900'}`}
                  >
                    {complaint.status}
                  </span>
                </TableCell>
                <TableCell>
                  {complaint.status === 'pending' && (
                    <div className="space-x-2">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleOpenDialog(complaint)}
                      >
                        Resolve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleOpenDialog(complaint)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Update Complaint Status</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Response"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleStatusUpdate(selectedComplaint._id, 'resolved')}
            color="success"
          >
            Resolve
          </Button>
          <Button
            onClick={() => handleStatusUpdate(selectedComplaint._id, 'rejected')}
            color="error"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserComplaintsList; 