import React, { useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import { useSelector } from "react-redux";
import Link from "next/link";
import axios from 'axios';
import FoodRecommendation from '../components/FoodRecommendation';

const Cart = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const { items } = useSelector((state) => state.cart);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate total amount from cart items
  useEffect(() => {
    const total = items.reduce((acc, curr) => {
      return acc + (curr.total || 0);
    }, 0);
    setTotalAmount(total);
  }, [items]);

  // Fetch recommendations based on cart items
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        if (items.length === 0) {
          setRecommendations([]);
          return;
        }

        const categories = [...new Set(items.map(item => item.category))];
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/food/recommendations`, 
          {
            params: { categories: categories.join(',') },
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setRecommendations(response.data.recommendations);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [items]);

  return (
    <div className="min-h-[80vh] bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {items.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-pink-500 mb-6">Your Cart</h2>
                {items.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
              <div className="bg-gray-800 rounded-lg p-6 h-fit">
                <h2 className="text-2xl font-semibold text-pink-500 mb-6">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-300">
                    <span>Total Items</span>
                    <span className="font-semibold">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-300 text-lg font-bold pt-4 border-t border-gray-700">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>

                  <Link href="/order">
                    <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
                      Proceed to Checkout
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="mt-12">
                <FoodRecommendation 
                  recommendations={recommendations} 
                  loading={loading} 
                />
              </div>
            )}
          </>
        ) : (
          <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-pink-500 mb-6">
              Your cart is empty!
            </h1>
            <p className="text-gray-400 mb-8">Add some delicious items to your cart</p>
            <Link href="/foods">
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
                Browse Menu
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
