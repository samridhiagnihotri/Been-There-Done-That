import React, { useState, useEffect } from "react";
import AdminDrawer from "../../components/admin/AdminDrawer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Router from "next/router";
import axiosInstance from "../../utils/axiosConfig";
import Loading from "../../components/Loading";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!user) {
      Router.push("/login");
    } else if (user.role !== "admin") {
      Router.push("/");
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/users');
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        enqueueSnackbar("Failed to fetch users", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Failed to fetch users", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await axiosInstance.put(
        `/api/admin/users/${userId}/role`,
        { role: newRole }
      );
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      
      enqueueSnackbar("User role updated successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Failed to update user role", {
        variant: "error",
      });
    }
  };

  const renderUserRow = (user) => (
    <tr key={user._id} className="border-b border-gray-700">
      <td className="px-6 py-4 text-white">{user.name}</td>
      <td className="px-6 py-4 text-white">{user.email}</td>
      <td className="px-6 py-4">
        <select
          value={user.role}
          onChange={(e) => updateUserRole(user._id, e.target.value)}
          className="bg-gray-700 text-white px-3 py-1 rounded border border-pink-400 focus:outline-none focus:border-pink-500"
        >
          <option value="user">User</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </td>
    </tr>
  );

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="hidden lg:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
            <AdminSidebar />
            <div className="flex flex-col items-center flex-grow">
              <h1 className="text-2xl font-semibold text-pink-400 mb-8">Users Management</h1>
              <div className="w-full max-w-4xl">
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-pink-300">Name</th>
                      <th className="px-6 py-3 text-left text-pink-300">Email</th>
                      <th className="px-6 py-3 text-left text-pink-300">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(renderUserRow)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="min-h-[83vh] p-3 lg:hidden">
            <div className="flex flex-col">
              <AdminDrawer />
              <div className="flex flex-col items-center mt-16">
                <h1 className="text-xl font-semibold text-pink-400 mb-6">Users Management</h1>
                <div className="w-full space-y-4">
                  {users.map((user) => (
                    <div key={user._id} className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-white"><span className="text-pink-300">Name:</span> {user.name}</p>
                      <p className="text-white"><span className="text-pink-300">Email:</span> {user.email}</p>
                      <div className="mt-2">
                        <span className="text-pink-300">Role:</span>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="ml-2 bg-gray-700 text-white px-3 py-1 rounded border border-pink-400 focus:outline-none focus:border-pink-500"
                        >
                          <option value="user">User</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Users;
