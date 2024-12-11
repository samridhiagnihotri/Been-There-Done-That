import { Cancel, Delete, Edit, Image } from "@mui/icons-material";
import React, { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Modal, CircularProgress } from "@mui/material";

const foodCategories = ["cold", "des", "hot", "pasta", "sides"];

const AdminFoodList = ({ item, refreshFoods }) => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState(item.name || "");
  const [category, setCategory] = useState(item.category || "");
  const [cost, setCost] = useState(
    typeof item.cost === 'object' && item.cost.$numberDecimal 
      ? parseFloat(item.cost.$numberDecimal)
      : parseFloat(item.cost)
  );
  const [description, setDescription] = useState(item.description || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("No authorization token found", { variant: "error" });
      setIsLoading(false);
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/food/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      enqueueSnackbar("Food deleted successfully", { variant: "success" });
      refreshFoods();
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "An error occurred", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      enqueueSnackbar("No authorization token found", { variant: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("cost", cost);
      formData.append("description", description);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/food/${item._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      enqueueSnackbar(response.data.message, { variant: "success" });
      setOpenModal(false);
      refreshFoods();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "An error occurred", {
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full max-w-2xl p-4 mb-4 bg-gray-800 rounded-lg">
      <div className="flex items-center">
        <img
          src={item.image?.startsWith('http') 
            ? item.image 
            : `${process.env.NEXT_PUBLIC_BASE_URL}${item.image}`
          }
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg mr-4"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-food.jpg';
            e.target.onerror = null;
          }}
        />
        <div>
          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
          <p className="text-gray-400">{item.category}</p>
          <p className="text-pink-400">
            ₹{typeof item.cost === 'object' && item.cost.$numberDecimal 
              ? parseFloat(item.cost.$numberDecimal).toFixed(2) 
              : parseFloat(item.cost).toFixed(2)}
          </p>
          <p className="text-gray-300 text-sm mt-1">{item.description}</p>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Edit
          onClick={() => setOpenModal(true)}
          className="text-pink-400 cursor-pointer hover:text-pink-300"
          aria-label="Edit Food Item"
        />
        {isLoading ? (
          <CircularProgress size={24} color="secondary" />
        ) : (
          <Delete
            onClick={handleDelete}
            className="text-pink-400 cursor-pointer hover:text-pink-300"
            aria-label="Delete Food Item"
          />
        )}
      </div>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="h-full w-full md:h-[600px] md:w-[450px] border-none rounded-lg outline-none bg-gray-700 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center relative justify-center h-full">
            <form
              className="flex flex-col items-center justify-center"
              onSubmit={handleUpdate}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-3 border-2 border-pink-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm"
                type="text"
                placeholder="Food name"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-3 border-2 border-pink-400 mt-3 bg-gray-700 rounded-lg outline-none font-semibold placeholder:text-sm text-white"
                required
              >
                <option value="">Select Category</option>
                {foodCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <input
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full p-3 border-2 border-pink-400 mt-3 bg-transparent rounded-lg outline-none font-semibold text-white placeholder:text-gray-400"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price (₹)"
                required
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-3 border-2 border-pink-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm w-full"
                placeholder="Description"
              />
              <div className="flex items-center justify-between mt-3">
                <label htmlFor="image">
                  <Image className="text-pink-500 text-3xl cursor-pointer" />{" "}
                  <h1 className="text-white text-sm font-semibold mt-2 mb-3">
                    {selectedImage?.name || "Select Image"}
                  </h1>
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  className="opacity-0 w-48"
                  id="image"
                  aria-label="Upload food image"
                />
              </div>
              <input
                type="submit"
                value={isLoading ? "Updating..." : "Update"}
                className="bg-white text-pink-500 font-bold p-3 outline-none rounded-lg w-full cursor-pointer mt-3 hover:bg-pink-400 hover:text-white transition duration-300 ease-in"
                disabled={isLoading}
              />
            </form>
            <div className="absolute top-2 left-2 flex justify-center items-center bg-gray-700 h-10 w-10 rounded-full cursor-pointer">
              <Cancel
                className="text-3xl"
                onClick={() => setOpenModal(false)}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminFoodList;
