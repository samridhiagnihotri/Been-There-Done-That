import { Delete } from "@mui/icons-material";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";

const AdminUsersList = ({ item, onDelete }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const token = window.localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/${item._id}`,
        {
          headers: { Authorization: token },
        }
      );
      enqueueSnackbar(response.data.message, {
        variant: "success",
        autoHideDuration: 3000,
      });
      onDelete(item._id); // Callback to remove item from the list
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Error deleting user", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center p-3 bg-gray-600 w-[18rem] md:w-[20rem] lg:w-[25rem] rounded-xl mb-3">
      <h1 className="text-pink-100 font-semibold">{item.name}</h1>
      <h1 className="text-pink-100 font-semibold">{item.email}</h1>
      <div>
        <Delete
          onClick={handleDelete}
          className={`text-pink-400 cursor-pointer ${loading ? "opacity-50" : ""}`}
        />
      </div>
    </div>
  );
};

export default AdminUsersList;
