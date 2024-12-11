import React from "react";
import { Bookmark, Fastfood, Group, Analytics, AccessTime, NotificationsActive, Dashboard, Message, Report, Work, LocalOffer } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard className="text-pink-400" />
    },
    {
      id: 'complaints',
      label: 'User Complaints',
      icon: <Report className="text-pink-400" />
    },
    {
      id: 'staffComplaints',
      label: 'Staff Complaints',
      icon: <Report className="text-pink-400" />
    },
    {
      id: 'shifts',
      label: 'Staff Shifts',
      icon: <Work className="text-pink-400" />
    }
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-[83vh] rounded-lg shadow-lg mr-8">
      <div className="flex flex-col py-4">
        <div className="text-pink-400 text-xl font-bold px-6 mb-4">
          Admin Dashboard
        </div>
        <Link href="/admin/foods">
          <a className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
            currentPath === '/admin/foods' ? 'bg-pink-500 text-white' : 'text-pink-300'
          }`}>
            <Fastfood className="mr-3" />
            <span>Food Items</span>
          </a>
        </Link>
        <Link href="/admin/shifts">
          <a className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
            currentPath === '/admin/shifts' ? 'bg-pink-500 text-white' : 'text-pink-300'
          }`}>
            <AccessTime className="mr-3" />
            <span>Shifts</span>
          </a>
        </Link>
        <Link href="/admin/users">
          <a className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
            currentPath === '/admin/users' ? 'bg-pink-500 text-white' : 'text-pink-300'
          }`}>
            <Group className="mr-3" />
            <span>Users</span>
          </a>
        </Link>
        <Link href="/admin/orders">
          <a className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
            currentPath === '/admin/orders' ? 'bg-pink-500 text-white' : 'text-pink-300'
          }`}>
            <Bookmark className="mr-3" />
            <span>Orders</span>
          </a>
        </Link>
        <Link href="/admin/dashboard">
          <a className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
            currentPath === '/admin/dashboard' ? 'bg-pink-500 text-white' : 'text-pink-300'
          }`}>
            <Analytics className="mr-3" />
            <span>Stats</span>
          </a>
        </Link>
        <Link href="/admin/staff-complaints">
          <a className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
            currentPath === '/admin/staff-complaints' ? 'bg-pink-500 text-white' : 'text-pink-300'
          }`}>
            <NotificationsActive className="mr-3" />
            <span>Complaints</span>
          </a>
        </Link>
        <Link href="/admin/coupons">
          <a className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
            currentPath === '/admin/coupons' ? 'bg-pink-500 text-white' : 'text-pink-300'
          }`}>
            <LocalOffer className="mr-3" />
            <span>Coupons</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
