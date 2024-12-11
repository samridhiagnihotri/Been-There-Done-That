import React, { useState, useEffect } from "react";
import AdminDrawer from "../../components/admin/AdminDrawer";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Add, Cancel, Image } from "@mui/icons-material";
import { Modal, Tooltip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchFoods } from "../../redux/actions/foodActions";
import { useSnackbar } from "notistack";
import Router from "next/router";
import axios from "axios";
import Loading from "../../components/Loading";
import AdminFoodList from "../../components/admin/AdminFoodList";

const foodCategories = ["cold", "des", "hot", "pasta", "sides"];

const Foods = () => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [cost, setCost] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const food = useSelector((state) => {
    console.log('Component Redux State:', {
      fullState: state,
      foodState: state.food,
      dataLength: state.food.data?.length,
      loading: state.food.loading,
      error: state.food.error
    });
    return state.food;
  });
  const { data, loading } = food;
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Auth state:', {
      hasToken: !!token,
      hasUser: !!user,
      userData: user
    });

    if (!token || !user) {
      Router.push("/");
    } else {
      dispatch(fetchFoods());
    }
  }, [dispatch, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authorization token found");
      }

      if (!name || !category || !cost || !description || !selectedImage) {
        throw new Error("Please fill in all fields");
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("cost", cost);
      formData.append("description", description);
      formData.append("image", selectedImage);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/food/new`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        enqueueSnackbar("Food item added successfully", { variant: "success" });
        dispatch(fetchFoods());
        setOpenModal(false);
        // Reset form
        setName("");
        setCategory("");
        setCost("");
        setDescription("");
        setSelectedImage(null);
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || error.message, {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="hidden lg:flex justify-center max-w-6xl mx-auto min-h-[83vh] p-3">
            <AdminSidebar />
            <div className="flex flex-col items-center">
              <h1 className="text-lg font-semibold text-pink-400 mb-5">FOOD ITEMS</h1>
              <button
                onClick={() => setOpenModal(true)}
                className="mb-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              >
                Add New Food Item
              </button>
              {Array.isArray(data) && data.length > 0 ? (
                data.map((item) => {
                  const transformedItem = {
                    ...item,
                    cost: item.cost.$numberDecimal ? parseFloat(item.cost.$numberDecimal) : parseFloat(item.cost)
                  };
                  console.log('Rendering food item:', transformedItem);
                  return (
                    <AdminFoodList
                      key={item._id}
                      item={{
                        ...transformedItem,
                        displayPrice: `₹${transformedItem.cost.toFixed(2)}`
                      }}
                      refreshFoods={() => dispatch(fetchFoods())}
                    />
                  );
                })
              ) : (
                <div>
                  <p className="text-gray-400">No food items available.</p>
                  <p className="text-sm text-gray-500">Debug info: {JSON.stringify({ data, loading })}</p>
                </div>
              )}
            </div>
          </div>

          <div className="min-h-[83vh] p-3 lg:hidden">
            <div className="flex flex-col">
              <AdminDrawer />
              <div className="flex flex-col justify-center items-center mt-3">
                <h1 className="text-lg font-semibold text-pink-400">FOOD ITEMS</h1>
                <button
                  onClick={() => setOpenModal(true)}
                  className="mb-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                >
                  Add New Food Item
                </button>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((item) => {
                    const transformedItem = {
                      ...item,
                      cost: item.cost.$numberDecimal ? parseFloat(item.cost.$numberDecimal) : parseFloat(item.cost)
                    };
                    console.log('Rendering food item:', transformedItem);
                    return (
                      <AdminFoodList
                        key={item._id}
                        item={{
                          ...transformedItem,
                          displayPrice: `₹${transformedItem.cost.toFixed(2)}`
                        }}
                        refreshFoods={() => dispatch(fetchFoods())}
                      />
                    );
                  })
                ) : (
                  <div>
                    <p className="text-gray-400">No food items available.</p>
                    <p className="text-sm text-gray-500">Debug info: {JSON.stringify({ data, loading })}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Tooltip title="Add new food">
            <div
              className="fixed h-14 w-14 cursor-pointer hover:scale-110 transition duration-300 ease-in bottom-32 right-4 md:right-28 rounded-full bg-pink-600 flex justify-center items-center"
              onClick={() => setOpenModal(true)}
            >
              <Add className="text-white font-bold text-3xl" />
            </div>
          </Tooltip>

          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <div className="h-full w-full md:h-[600px] md:w-[450px] border-none rounded-lg outline-none bg-gray-700 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center relative justify-center h-full">
                <form
                  className="flex flex-col items-center justify-center"
                  onSubmit={handleSubmit}
                >
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 border-2 border-pink-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm text-white"
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
                        {cat === 'des' ? 'Desserts' :
                         cat === 'cold' ? 'Cold Items' :
                         cat === 'hot' ? 'Hot Items' :
                         cat === 'pasta' ? 'Pasta' :
                         'Side Dishes'}
                      </option>
                    ))}
                  </select>
                  <input
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="p-3 border-2 border-pink-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm text-white"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Price (₹)"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-3 border-2 border-pink-400 mt-3 bg-transparent rounded-lg outline-none font-semibold placeholder:text-sm text-white"
                    placeholder="Description"
                    rows="3"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="p-3 border-2 border-pink-400 mt-3 bg-transparent rounded-lg outline-none font-semibold text-white"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Food"}
                  </button>
                </form>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default Foods;
