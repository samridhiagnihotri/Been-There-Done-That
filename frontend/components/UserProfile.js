import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Person, History, Help, Report } from '@mui/icons-material';
import axios from 'axios';
import Image from 'next/image';
import { useSnackbar } from 'notistack';

const OrderItem = ({ order }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-pink-300 font-semibold">Order #{order._id.slice(-6)}</span>
        <span className={`px-3 py-1 rounded-full text-sm ${
          order.status === 'completed' ? 'bg-green-500' : 
          order.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
        } text-white`}>
          {order.status}
        </span>
      </div>
      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            {item.image && (
              <div className="relative w-16 h-16">
                <Image
                  src={item.image}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            )}
            <div className="flex-grow">
              <p className="text-white">{item.name}</p>
              <p className="text-gray-400">Quantity: {item.quantity}</p>
              <p className="text-pink-300">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="flex justify-between text-gray-300">
          <span>Total Amount:</span>
          <span className="text-pink-300 font-semibold">₹{order.totalAmount}</span>
        </div>
        <div className="text-gray-400 mt-2">
          <p>Delivery Address: {order.address}</p>
          <p>Payment Method: {order.paymentMethod}</p>
          <p>Ordered on: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium'
  });
  const { enqueueSnackbar } = useSnackbar();

  // Fetch user orders when orders tab is active
  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab !== 'orders') return;
      
      setOrdersLoading(true);
      setOrdersError('');
      
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrdersError('Failed to load orders. Please try again later.');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (response.data.success) {
          setProfileData({
            name: response.data.user.name || '',
            email: response.data.user.email || '',
            phone: response.data.user.phone || '',
            address: response.data.user.address || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUpdateError('Failed to load user profile');
        enqueueSnackbar("Failed to load profile", { variant: "error" });
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'complaints') {
      fetchComplaints();
    }
  }, [activeTab]);

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/complaints`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setComplaints(response.data.complaints);
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      enqueueSnackbar('Failed to fetch complaints', { variant: 'error' });
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/complaints`,
        newComplaint,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        enqueueSnackbar('Complaint submitted successfully', { variant: 'success' });
        setNewComplaint({
          subject: '',
          description: '',
          category: 'general',
          priority: 'medium'
        });
        fetchComplaints();
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Failed to submit complaint', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setUpdateError('');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Validate phone number
      if (profileData.phone && !/^\d{10}$/.test(profileData.phone)) {
        setUpdateError('Please enter a valid 10-digit phone number');
        setIsSubmitting(false);
        return;
      }

      const updateData = {
        name: profileData.name.trim(),
        phone: profileData.phone?.trim() || '',
        address: profileData.address?.trim() || ''
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          ...response.data.user
        }));
        
        setIsEditing(false);
        enqueueSnackbar("Profile updated successfully", { 
          variant: "success",
          autoHideDuration: 3000
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setUpdateError(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
      );
      enqueueSnackbar(
        error.response?.data?.message || 
        "Failed to update profile", 
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-custom bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-1/4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-2 p-3 rounded-lg ${
                    activeTab === 'profile' ? 'bg-pink-500 text-white' : 'text-pink-300'
                  }`}
                >
                  <Person className="w-6 h-6" />
                  <span>Profile Info</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center space-x-2 p-3 rounded-lg ${
                    activeTab === 'orders' ? 'bg-pink-500 text-white' : 'text-pink-300'
                  }`}
                >
                  <History className="w-6 h-6" />
                  <span>Order History</span>
                </button>
                <button
                  onClick={() => setActiveTab('complaints')}
                  className={`flex items-center space-x-2 p-3 rounded-lg ${
                    activeTab === 'complaints' ? 'bg-pink-500 text-white' : 'text-pink-300'
                  }`}
                >
                  <Report className="w-6 h-6" />
                  <span>Complaints</span>
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`flex items-center space-x-2 p-3 rounded-lg ${
                    activeTab === 'help' ? 'bg-pink-500 text-white' : 'text-pink-300'
                  }`}
                >
                  <Help className="w-6 h-6" />
                  <span>Help & Support</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-pink-300">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleProfileUpdate}
                          disabled={isSubmitting}
                          className={`px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors ${
                            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>

                  {updateError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                      {updateError}
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full p-3 rounded-lg ${
                          isEditing 
                            ? 'bg-gray-700 text-white border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full p-3 bg-gray-700 text-gray-400 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        placeholder="10-digit phone number"
                        className={`w-full p-3 rounded-lg ${
                          isEditing 
                            ? 'bg-gray-700 text-white border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">Address</label>
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows="3"
                        className={`w-full p-3 rounded-lg ${
                          isEditing 
                            ? 'bg-gray-700 text-white border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      />
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-pink-300 mb-6">Order History</h2>
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
                      <p className="text-gray-400 mt-4">Loading orders...</p>
                    </div>
                  ) : ordersError ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                      {ordersError}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <OrderItem key={order._id} order={order} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'complaints' && (
                <div>
                  <h2 className="text-2xl font-semibold text-pink-500 mb-6">Submit a Complaint</h2>
                  <form onSubmit={handleComplaintSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Subject (minimum 3 characters)</label>
                      <input
                        type="text"
                        value={newComplaint.subject}
                        onChange={(e) => setNewComplaint({...newComplaint, subject: e.target.value})}
                        className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500"
                        required
                        minLength={3}
                        maxLength={100}
                        placeholder="Brief subject of your complaint"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Issue Category</label>
                      <select
                        value={newComplaint.category}
                        onChange={(e) => setNewComplaint({...newComplaint, category: e.target.value})}
                        className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500"
                        required
                      >
                        <option value="general">General Issue</option>
                        <option value="food">Food Quality/Taste Issue</option>
                        <option value="service">Service Related Issue</option>
                        <option value="delivery">Delivery Related Issue</option>
                        <option value="other">Other Issue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Priority</label>
                      <select
                        value={newComplaint.priority}
                        onChange={(e) => setNewComplaint({...newComplaint, priority: e.target.value})}
                        className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Description (minimum 10 characters)</label>
                      <textarea
                        value={newComplaint.description}
                        onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                        className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-pink-500 h-32 resize-none"
                        required
                        minLength={10}
                        maxLength={1000}
                        placeholder="Please provide detailed information about your complaint"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {newComplaint.description.length}/1000 characters (minimum 10)
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || 
                        newComplaint.subject.trim().length < 3 || 
                        newComplaint.description.trim().length < 10}
                      className={`w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors ${
                        isSubmitting || 
                        newComplaint.subject.trim().length < 3 || 
                        newComplaint.description.trim().length < 10
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                  </form>

                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-pink-500 mb-4">My Complaints</h3>
                    <div className="space-y-4">
                      {complaints.map((complaint) => (
                        <div key={complaint._id} className="bg-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-white font-medium">{complaint.subject}</h4>
                              <p className="text-gray-300 mt-1">{complaint.description}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-2 py-1 rounded text-sm text-white ${
                                complaint.status === 'resolved' ? 'bg-green-500' :
                                complaint.status === 'rejected' ? 'bg-red-500' :
                                complaint.status === 'in-progress' ? 'bg-yellow-500' :
                                'bg-gray-500'
                              }`}>
                                {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                              </span>
                              <span className={`px-2 py-1 rounded text-sm text-white ${
                                complaint.priority === 'high' ? 'bg-red-500' :
                                complaint.priority === 'medium' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}>
                                {complaint.priority} priority
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-400">
                            <p>Category: {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</p>
                            <p>Submitted: {new Date(complaint.createdAt).toLocaleDateString()}</p>
                            {complaint.response && (
                              <div className="mt-2 p-2 bg-gray-600 rounded">
                                <p className="font-medium text-pink-300">Response:</p>
                                <p className="text-gray-300">{complaint.response}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {complaints.length === 0 && (
                        <p className="text-gray-400 text-center">No complaints submitted yet</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div>
                  <h2 className="text-2xl font-semibold text-pink-500 mb-6">Help & Support</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-2">Contact Us</h3>
                      <p className="text-gray-300">
                        For immediate assistance, you can reach us at:
                      </p>
                      <ul className="list-disc list-inside text-gray-300 mt-2">
                        <li>Email: support@btdt.com</li>
                        <li>Phone: +91 234 567 8900</li>
                        <li>Hours: 9:00 AM - 10:00 PM</li>
                      </ul>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-2">FAQs</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-pink-300 font-medium">How do I track my order?</h4>
                          <p className="text-gray-300">You can track your order in the Order History section of your profile.</p>
                        </div>
                        <div>
                          <h4 className="text-pink-300 font-medium">What payment methods do you accept?</h4>
                          <p className="text-gray-300">We accept credit/debit cards and digital wallets.</p>
                        </div>
                        <div>
                          <h4 className="text-pink-300 font-medium">How can I modify my order?</h4>
                          <p className="text-gray-300">You can modify your order within 5 minutes of placing it by contacting support.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 