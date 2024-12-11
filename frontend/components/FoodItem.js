import { Cancel } from "@mui/icons-material";
import { Modal } from "@mui/material";
import React, { useState, useEffect } from "react";
import { addToCart, removeFromCart } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import AddReview from "./AddR";
import ReviewList from "./ReviewList";
import axios from "axios";

const FoodItem = ({ item = {}, category }) => {
  const [openModal, setOpenModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { items: cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [showReviews, setShowReviews] = useState(false);

  if (!item || !item._id) {
    return null;
  }

  const categoryDisplay = {
    hot: 'Hot Beverage',
    cold: 'Cold Beverage',
    des: 'Dessert',
    pasta: 'Pasta',
    sides: 'Sides'
  };

  const price = item.price
    ? (typeof item.price === 'object' && item.price.$numberDecimal
      ? parseFloat(item.price.$numberDecimal)
      : parseFloat(item.price))
    : item.cost
      ? (typeof item.cost === 'object' && item.cost.$numberDecimal
        ? parseFloat(item.cost.$numberDecimal)
        : parseFloat(item.cost))
      : 0;

  const handleAddToCart = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login to add items to cart', { variant: 'warning' });
        return;
      }

      const cartItem = {
        _id: item._id,
        name: item.name,
        price: price,
        quantity: 1,
        image: item.image,
        category: item.category || category
      };

      dispatch(addToCart(cartItem));
      enqueueSnackbar('Item added to cart!', { variant: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      enqueueSnackbar('Failed to add item to cart', { variant: 'error' });
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="relative">
        <img
          src={item.image}
          alt={item.name || 'Food item'}
          className="w-full h-48 object-cover"
        />
        {category && categoryDisplay[category] && (
          <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-lg text-sm">
            {categoryDisplay[category]}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-pink-100">{item.name}</h3>
          <span className="text-lg font-bold text-pink-500">₹{price.toFixed(2)}</span>
        </div>

        {item.description && (
          <p className="text-gray-300 mb-4">{item.description}</p>
        )}

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleAddToCart}
            className="bg-pink-500 px-4 py-2 rounded-lg text-white font-bold hover:bg-pink-600 transition duration-300"
          >
            Add to Cart
          </button>
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="text-pink-400 hover:text-pink-500 transition duration-300 flex items-center gap-2"
          >
            <span>{showReviews ? 'Hide Reviews' : 'Show Reviews'}</span>
            <svg className={`w-4 h-4 transform transition-transform ${showReviews ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {showReviews && (
          <div className="border-t border-gray-700 pt-4 mt-4">
            <AddReview
              foodItemId={item._id}
              onReviewAdded={() => setShowReviews(true)}
            />
            <div className="mt-4">
              <ReviewList foodItemId={item._id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;