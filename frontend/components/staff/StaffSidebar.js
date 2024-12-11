import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Assignment, ExitToApp, Notifications } from '@mui/icons-material';

const StaffSidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const isActive = (path) => {
    return currentPath === path ? 'bg-pink-500' : 'hover:bg-gray-700';
  };

  return (
    <div className="w-64 bg-gray-800 min-h-full rounded-lg p-4">
      <div className="space-y-4">
        <Link href="/staff/dashboard">
          <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isActive('/staff/dashboard')}`}>
            <Home className="text-pink-400" />
            <span className="text-white">Dashboard</span>
          </div>
        </Link>

        <Link href="/staff/orders">
          <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isActive('/staff/orders')}`}>
            <Assignment className="text-pink-400" />
            <span className="text-white">Orders</span>
          </div>
        </Link>

     
      </div>
    </div>
  );
};

export default StaffSidebar;
