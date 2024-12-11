import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminDrawer from '../../components/admin/AdminDrawer';
import StaffComplaintsList from '../../components/admin/StaffComplaintsList';
import UserComplaintsList from '../../components/admin/UserComplaintsList';

const StaffComplaints = () => {
  const [error, setError] = useState(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Desktop View */}
      <div className="hidden md:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
        <AdminSidebar />
        <div className="flex-grow min-w-fit ml-5">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-pink-400 mb-6">
              COMPLAINTS MANAGEMENT
            </h1>
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="w-full space-y-8">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-pink-400 mb-4">Staff Complaints</h2>
                  <StaffComplaintsList />
                </div>
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-pink-400 mb-4">User Complaints</h2>
                  <UserComplaintsList />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden min-h-[83vh] p-3">
        <AdminDrawer />
        <div className="mt-3">
          <h1 className="text-2xl font-semibold text-pink-400 text-center mb-6">
            COMPLAINTS MANAGEMENT
          </h1>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="w-full space-y-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-pink-400 mb-4">Staff Complaints</h2>
                <StaffComplaintsList />
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-pink-400 mb-4">User Complaints</h2>
                <UserComplaintsList />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffComplaints; 