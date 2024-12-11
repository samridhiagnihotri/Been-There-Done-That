import React from 'react';
import { Dashboard, Report, Work, LocalOffer } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminDrawer = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard className="text-pink-400" />,
      path: '/admin/dashboard'
    },
    {
      id: 'complaints',
      label: 'User Complaints',
      icon: <Report className="text-pink-400" />,
      path: '/admin/staff-complaints'
    },
    {
      id: 'staffComplaints',
      label: 'Staff Complaints',
      icon: <Report className="text-pink-400" />,
      path: '/admin/staff-complaints'
    },
    {
      id: 'shifts',
      label: 'Staff Shifts',
      icon: <Work className="text-pink-400" />,
      path: '/admin/shifts'
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: <LocalOffer className="text-pink-400" />,
      path: '/admin/coupons'
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="text-pink-400 text-xl font-bold mb-4">
        Admin Dashboard
      </div>
      <div className="space-y-2">
        {tabs.map((tab) => (
          <Link href={tab.path} key={tab.id}>
            <a className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              currentPath === tab.path
                ? 'bg-pink-500 text-white'
                : 'text-pink-300 hover:bg-gray-700'
            }`}>
              {tab.icon}
              <span>{tab.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDrawer;
