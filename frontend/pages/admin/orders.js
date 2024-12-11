import React, { useState, useEffect } from "react";
import AdminDrawer from "../../components/admin/AdminDrawer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setOrders } from "../../redux/slices/orderSlice";
import Router from "next/router";
import { useSnackbar } from "notistack";
import { Delete } from "@mui/icons-material";
import AdminOrderList from "../../components/admin/AdminOrderList";
import CircularProgress from '@mui/material/CircularProgress';

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    if (!user) {
      Router.push('/login');
      return;
    } else if (user.role !== 'admin') {
      Router.push('/');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setAllOrders(response.data.orders);
      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || 'Failed to fetch orders', {
          variant: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, enqueueSnackbar]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
        <AdminSidebar />
        <div className="flex-grow ml-5">
          <h1 className="text-2xl font-semibold text-pink-400 mb-8">Orders</h1>
          <div className="space-y-4">
            {allOrders.map((order) => (
              <AdminOrderList
                key={order._id}
                item={order}
                allOrders={allOrders}
                setAllOrders={setAllOrders}
              />
            ))}
            {allOrders.length === 0 && (
              <p className="text-center text-gray-400">No orders found</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden min-h-[83vh] p-3">
        <AdminDrawer />
        <div className="mt-16">
          <h1 className="text-xl font-semibold text-pink-400 mb-6">Orders</h1>
          <div className="space-y-4">
            {allOrders.map((order) => (
              <AdminOrderList
                key={order._id}
                item={order}
                allOrders={allOrders}
                setAllOrders={setAllOrders}
              />
            ))}
            {allOrders.length === 0 && (
              <p className="text-center text-gray-400">No orders found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
