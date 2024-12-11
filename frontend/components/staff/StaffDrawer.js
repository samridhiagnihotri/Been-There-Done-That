import React, { useState } from "react";
import { Bookmark, Fastfood, Group, MoreVert, AccessTime } from "@mui/icons-material";
import { Drawer } from "@mui/material";
import Link from "next/link";

const StaffDrawer = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  // Function to handle closing the drawer
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <>
      <div className="flex justify-between items-center z-40 fixed top-20 p-2 bg-gray-900 w-[95vw] mx-auto">
        <h1 className="text-lg font-semibold text-pink-100">DASHBOARD</h1>
        <MoreVert
          onClick={() => setOpenDrawer(!openDrawer)}
          className="text-pink-500"
        />
      </div>
      <Drawer
        open={openDrawer}
        onClose={handleDrawerClose}
        anchor="right"
      >
        <div className="w-1/2 bg-gray-900 h-full">
          <div className="flex flex-col justify-center space-y-5 p-5 mt-5">
            <Link href="/staff/dashboard">
              <a onClick={handleDrawerClose} className="flex items-center cursor-pointer space-x-4">
                <AccessTime className="text-pink-400" />
                <h1 className="text-pink-100 font-semibold">DASHBOARD</h1>
              </a>
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default StaffDrawer;
