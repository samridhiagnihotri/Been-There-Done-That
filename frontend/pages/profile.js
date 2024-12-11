import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Router from "next/router";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from '@mui/material';
import { Person, History, Report, Help } from '@mui/icons-material';
import UserProfile from '../components/UserProfile';
// Then replace the entire Profile component with UserProfile
const Profile = () => {
  return <UserProfile />;
};

export default Profile;

// const Profile = () => {
//   const { user } = useSelector((state) => state.user);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//   });
//   const { enqueueSnackbar } = useSnackbar();
//   const [activeTab, setActiveTab] = useState('profile');
//   const [complaints, setComplaints] = useState([]);

//   useEffect(() => {
//     if (!user) {
//       Router.push("/login");
//     } else {
//       setProfileData({
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         address: user.address || '',
//       });
//       fetchUserOrders();
//       fetchComplaints();
//     }
//   }, [user]);

//   const fetchUserOrders = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/orders`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setOrders(response.data.orders);
//       setLoading(false);
//     } catch (error) {
//       enqueueSnackbar("Failed to fetch orders", { variant: "error" });
//       setLoading(false);
//     }
//   };

//   const fetchComplaints = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/complaints`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
      
//       if (response.data.success) {
//         setComplaints(response.data.complaints || []);
//       }
//     } catch (error) {
//       console.error('Error fetching complaints:', error.response || error);
//       enqueueSnackbar(error.response?.data?.message || "Failed to fetch complaints", { 
//         variant: "error" 
//       });
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update`,
//         profileData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
      
//       if (response.data.success) {
//         setIsEditing(false);
//         enqueueSnackbar("Profile updated successfully", { variant: "success" });
//         setProfileData(response.data.user);
//       }
//     } catch (error) {
//       enqueueSnackbar(error.response?.data?.message || "Failed to update profile", { 
//         variant: "error" 
//       });
//     }
//   };

//   if (!user) return null;
//   if (loading) return <CircularProgress />;

//   return (
//     <div className="min-h-screen bg-gray-900 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="bg-gray-800 rounded-lg shadow-xl p-6">
//           <div className="flex flex-col md:flex-row gap-6">
//             {/* Sidebar */}
//             <div className="w-full md:w-1/4">
//               <div className="flex flex-col space-y-4">
//                 <button
//                   onClick={() => setActiveTab('profile')}
//                   className={`flex items-center space-x-2 p-3 rounded-lg ${
//                     activeTab === 'profile' ? 'bg-pink-500 text-white' : 'text-pink-300'
//                   }`}
//                 >
//                   <Person className="w-6 h-6" />
//                   <span>Profile Info</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('orders')}
//                   className={`flex items-center space-x-2 p-3 rounded-lg ${
//                     activeTab === 'orders' ? 'bg-pink-500 text-white' : 'text-pink-300'
//                   }`}
//                 >
//                   <History className="w-6 h-6" />
//                   <span>Order History</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('complaints')}
//                   className={`flex items-center space-x-2 p-3 rounded-lg ${
//                     activeTab === 'complaints' ? 'bg-pink-500 text-white' : 'text-pink-300'
//                   }`}
//                 >
//                   <Report className="w-6 h-6" />
//                   <span>Complaints</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('help')}
//                   className={`flex items-center space-x-2 p-3 rounded-lg ${
//                     activeTab === 'help' ? 'bg-pink-500 text-white' : 'text-pink-300'
//                   }`}
//                 >
//                   <Help className="w-6 h-6" />
//                   <span>Help & Support</span>
//                 </button>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div className="flex-1">
//               {activeTab === 'profile' && (
//                 <div>
//                   <h2 className="text-2xl font-semibold text-pink-500 mb-6">Profile Information</h2>
//                   <form onSubmit={handleProfileUpdate} className="space-y-4">
//                     {/* Profile form fields */}
//                     <div>
//                       <label className="block text-gray-300 mb-2">Name</label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={profileData.name}
//                         onChange={handleInputChange}
//                         disabled={!isEditing}
//                         className="w-full p-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
//                       />
//                     </div>
//                     {/* Add other profile fields */}
//                     <div className="flex justify-end space-x-4">
//                       {!isEditing ? (
//                         <button
//                           type="button"
//                           onClick={() => setIsEditing(true)}
//                           className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
//                         >
//                           Edit Profile
//                         </button>
//                       ) : (
//                         <>
//                           <button
//                             type="button"
//                             onClick={() => setIsEditing(false)}
//                             className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             type="submit"
//                             className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
//                           >
//                             Save Changes
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </form>
//                 </div>
//               )}

//               {activeTab === 'orders' && (
//                 <div>
//                   <h2 className="text-2xl font-semibold text-pink-500 mb-6">Order History</h2>
//                   <div className="space-y-4">
//                     {orders.map((order) => (
//                       <div key={order._id} className="bg-gray-700 p-4 rounded-lg">
//                         {/* Order details */}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'complaints' && (
//                 <div>
//                   <h2 className="text-2xl font-semibold text-pink-500 mb-6">Submit a Complaint</h2>
                  
//                   <ComplaintForm 
//                     onSubmit={async (formData) => {
//                       try {
//                         const token = localStorage.getItem('token');
//                         if (!token) {
//                           throw new Error('No authentication token found');
//                         }

//                         const response = await axios.post(
//                           `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/complaints`,
//                           formData,
//                           {
//                             headers: {
//                               Authorization: `Bearer ${token}`,
//                               'Content-Type': 'application/json',
//                             },
//                           }
//                         );
                        
//                         if (response.data.success) {
//                           enqueueSnackbar("Complaint submitted successfully", { variant: "success" });
//                           await fetchComplaints();
//                         }
//                       } catch (error) {
//                         console.error('Complaint submission error:', error);
//                         enqueueSnackbar(
//                           error.response?.data?.message || 
//                           error.message || 
//                           "Failed to submit complaint", 
//                           { variant: "error" }
//                         );
//                       }
//                     }}
//                     onCancel={() => setActiveTab('profile')}
//                   />

//                   {/* Complaints List */}
//                   <div className="mt-8">
//                     <h3 className="text-xl font-semibold text-pink-500 mb-4">My Complaints</h3>
//                     <div className="space-y-4">
//                       {complaints.map((complaint) => (
//                         <div key={complaint._id} className="bg-gray-700 p-4 rounded-lg">
//                           {/* Complaint details */}
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'help' && (
//                 <div>
//                   <h2 className="text-2xl font-semibold text-pink-500 mb-6">Help & Support</h2>
//                   {/* Help content */}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;