import React, { useState } from "react";
import { userLogout } from "../../redux/slices/userSlice";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useMediaQuery, useTheme, Drawer } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import {
  ShoppingBasket,
  Menu,
  Home,
  PersonAdd,
  AdminPanelSettingsOutlined,
  Logout,
  Explore,
  Person,
} from "@mui/icons-material";
import CartIcon from '../CartIcon';

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  // Check if we're on the login page
  const isLoginPage = router.pathname === '/login';

  // If we're on the login page, only show the logo
  if (isLoginPage) {
    return (
      <nav className="max-w-8xl mx-auto flex items-center justify-center h-20 p-7 z-50 sticky top-0 bg-black bg-opacity-100 shadow-lg px-3">
        <div className="flex items-center justify-between w-full">
          <Link href={"/"}>
            <a>
              <h1 className="logo text-4xl md:text-5xl font-bold tracking-wider bg-gradient-to-br from-pink-300 to-pink-400 cursor-pointer bg-clip-text text-transparent">
                Bean there, done that
              </h1>
            </a>
          </Link>
        </div>
      </nav>
    );
  }

  const handleLogout = () => {
    dispatch(userLogout());
    router.push('/login');
  };

  const renderNavLinks = () => {
    if (!user) {
      return (
        <Link href="/login">
          <a className="nav-link">
            <div className="flex items-center space-x-2">
              <PersonAdd className="text-pink-500" />
              <span className="text-pink-100 font-semibold">Login</span>
            </div>
          </a>
        </Link>
      );
    }

    return (
      <>
        {user.role === "admin" && (
          <Link href="/admin/foods">
            <a className="nav-link">
              <div className="flex items-center space-x-2">
                <AdminPanelSettingsOutlined className="text-pink-500" />
                <span className="text-pink-100 font-semibold">Dashboard</span>
              </div>
            </a>
          </Link>
        )}
        {user.role === "user" && (
          <Link href="/profile">
            <a className="nav-link">
              <div className="flex items-center space-x-2">
                <Person className="text-pink-500" />
                <span className="text-pink-100 font-semibold">Profile</span>
              </div>
            </a>
          </Link>
        )}
        {user.role === "staff" && (
          <Link href="/staff/dashboard">
            <a className="nav-link">
              <div className="flex items-center space-x-2">
                <AdminPanelSettingsOutlined className="text-pink-500" />
                <span className="text-pink-100 font-semibold">Dashboard</span>
              </div>
            </a>
          </Link>
        )}
        <Link href="/login">
          <a className="nav-link" onClick={handleLogout}>
            <div className="flex items-center space-x-2">
              <Logout className="text-pink-500" />
              <span className="text-pink-100 font-semibold">Logout</span>
            </div>
          </a>
        </Link>
      </>
    );
  };

  return (
    <>
      <nav className="max-w-8xl mx-auto flex items-center justify-between h-20 p-7 z-50 sticky top-0 bg-black bg-opacity-100 shadow-lg px-3">
        <div className="flex items-center">
          <Link href={"/"}>
            <a>
              <h1 className="logo text-4xl md:text-5xl font-bold tracking-wider bg-gradient-to-br from-pink-300 to-pink-400 cursor-pointer bg-clip-text text-transparent">
                Bean there, done that
              </h1>
            </a>
          </Link>
        </div>

        <div className="text-pink-100 md:text-lg flex items-center font-semibold space-x-6">
          {isMatch ? (
            <>
              <Drawer
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                anchor="top"
              >
                <div className="bg-gray-900 min-h-[30vh] p-3">
                  <Link href="/">
                    <a className="nav-link" onClick={() => setOpenDrawer(false)}>
                      <div className="flex items-center space-x-2">
                        <Home className="text-pink-500" />
                        <span className="text-pink-100 font-semibold">Home</span>
                      </div>
                    </a>
                  </Link>
                  <Link href="/foods">
                    <a className="nav-link" onClick={() => setOpenDrawer(false)}>
                      <div className="flex items-center space-x-2">
                        <Explore className="text-pink-500" />
                        <span className="text-pink-100 font-semibold">Explore</span>
                      </div>
                    </a>
                  </Link>
                  {renderNavLinks()}
                </div>
              </Drawer>
              <Menu
                className="text-pink-100 cursor-pointer"
                onClick={() => setOpenDrawer(!openDrawer)}
              />
            </>
          ) : (
            <>
              <Link href="/">
                <a className="nav-link">
                  <div className="flex items-center space-x-2">
                    <Home className="text-pink-500" />
                    <span>Home</span>
                  </div>
                </a>
              </Link>
              <Link href="/foods">
                <a className="nav-link">
                  <div className="flex items-center space-x-2">
                    <Explore className="text-pink-500" />
                    <span>Explore</span>
                  </div>
                </a>
              </Link>
              {renderNavLinks()}
            </>
          )}

          {user && (
            <div className="flex items-center">
              <CartIcon />
            </div>
          )}
        </div>
      </nav>

      <style jsx>{`
        .nav-link {
          @apply cursor-pointer hover:text-pink-500 transition duration-300 ease-in;
        }
        .nav-link div {
          @apply flex items-center space-x-2;
        }
      `}</style>
    </>
  );
};

export default Navbar;
