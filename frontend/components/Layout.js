// components/Layout.js

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../redux/slices/userSlice"; // Ensure the path is correct
import Footer from "./Footer";
import Navbar from "./navbar/Navbar";

const Layout = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch(userLogin(user));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      {children}  {/* Render child components */}
      <Footer />
    </>
  );
};

export default Layout;
