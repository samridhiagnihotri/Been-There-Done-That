import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import axios from "axios";
import Loading from "../components/Loading";
import Router from "next/router";
import { clearCart } from "../redux/slices/cartSlice";

const Order = () => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    orderType: "delivery",
    paymentMethod: "cash"
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [calculatedDiscount, setCalculatedDiscount] = useState(0);

  // Redux
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        address: user.address || ""
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      enqueueSnackbar("Please login to place an order", {
        variant: "warning",
        autoHideDuration: 3000,
      });
      Router.push("/login");
    }
  }, [user, enqueueSnackbar]);

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return sum + (price * quantity);
  }, 0);

  const calculateTotal = () => {
    const discount = parseFloat(calculatedDiscount) || 0;
    const total = Math.max(subtotal - discount, 0);
    return isNaN(total) ? 0 : total;
  };

  // Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCoupon = async () => {
    try {
      setValidatingCoupon(true);
      setCouponError("");

      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar("Please login to apply coupon", { variant: "error" });
        return;
      }

      // Check if cart is empty
      if (!items || items.length === 0) {
        setCouponError("Your cart is empty!");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/coupons/validate`,
        { 
          code: couponCode,
          orderAmount: subtotal  // Send current order amount
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        const coupon = response.data.coupon;

        // Check minimum order amount
        if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
          setCouponError(`Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`);
          setAppliedCoupon(null);
          setCalculatedDiscount(0);
          return;
        }

        setAppliedCoupon(coupon);
        
        // Calculate discount based on coupon type
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * (coupon.discountValue / 100));
        } else {
          discountAmount = parseFloat(coupon.discountValue);
        }

        // Apply maximum discount if specified
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = parseFloat(coupon.maxDiscount);
        }

        // Ensure discount doesn't exceed order amount
        discountAmount = Math.min(discountAmount, subtotal);
        
        setCalculatedDiscount(discountAmount);
        enqueueSnackbar(`Coupon "${coupon.name}" applied successfully!`, { variant: "success" });
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      setCouponError(error.response?.data?.message || "Failed to validate coupon");
      setAppliedCoupon(null);
      setCalculatedDiscount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    setCalculatedDiscount(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate inputs
      if (!formData.name.trim() || !formData.email.trim()) {
        enqueueSnackbar("Please fill in all required fields", {
          variant: "warning",
          autoHideDuration: 3000,
        });
        return;
      }

      if (formData.orderType === 'delivery' && !formData.address.trim()) {
        enqueueSnackbar("Please provide a delivery address", {
          variant: "warning",
          autoHideDuration: 3000,
        });
        return;
      }

      if (!items || items.length === 0) {
        enqueueSnackbar("Your cart is empty!", {
          variant: "error",
          autoHideDuration: 3000,
        });
        Router.push("/menu");
        return;
      }

      setLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar("Please login to place order", { variant: "error" });
        Router.push("/login");
        return;
      }

      const orderData = {
        items: items.map(item => ({
          foodItemId: item._id,
          name: item.name,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price)
        })),
        name: formData.name.trim(),
        email: formData.email.trim(),
        orderType: formData.orderType,
        address: formData.orderType === 'delivery' ? formData.address.trim() : '',
        paymentMethod: 'cash',
        subtotal: subtotal,
        totalAmount: calculateTotal()
      };

      if (appliedCoupon) {
        orderData.coupon = {
          code: appliedCoupon.code,
          discountAmount: calculatedDiscount
        };
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        dispatch(clearCart());
        enqueueSnackbar("Order placed successfully!", {
          variant: "success",
          autoHideDuration: 3000,
        });
        Router.push("/thankyou");
      }
    } catch (error) {
      console.error('Order submission error:', error);
      enqueueSnackbar(error.response?.data?.message || "Failed to place order", {
        variant: "error",
        autoHideDuration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-custom bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-custom bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-pink-500 text-center mb-8">
          Complete Your Order
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  type="text"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Order Type</label>
                <select
                  name="orderType"
                  value={formData.orderType}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                >
                  <option value="delivery">Delivery</option>
                  <option value="takeout">Takeout</option>
                  <option value="dine-in">Dine-in</option>
                </select>
              </div>

              {formData.orderType === 'delivery' && (
                <div>
                  <label className="block text-gray-300 mb-2">Delivery Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    rows="3"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-300 mb-2">Payment Method</label>
                <select
                  name="paymentMethod"
                  value="cash"
                  disabled
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="cash">Cash on Delivery</option>
                </select>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-pink-500 mb-4">Apply Coupon</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 p-2 bg-gray-600 border border-gray-500 rounded text-white"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={validateCoupon}
                    disabled={!couponCode || validatingCoupon}
                    className={`px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 ${
                      (!couponCode || validatingCoupon) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {validatingCoupon ? 'Validating...' : 'Apply'}
                  </button>
                )}
              </div>
              {couponError && (
                <p className="mt-2 text-red-500 text-sm">{couponError}</p>
              )}
              {appliedCoupon && (
                <div className="mt-2 p-2 bg-gray-600 rounded">
                  <p className="text-green-500">{appliedCoupon.name}</p>
                  <p className="text-sm text-gray-300">
                    {appliedCoupon.discountType === 'percentage' 
                      ? `${appliedCoupon.discountValue}% off`
                      : `₹${appliedCoupon.discountValue} off`}
                  </p>
                  <p className="text-sm text-pink-400">
                    Discount: ₹{(calculatedDiscount || 0).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-pink-500 mb-4">Order Summary</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-300">
                    <span>{item.name} × {item.quantity || 1}</span>
                    <span>₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {calculatedDiscount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount</span>
                      <span>-₹{calculatedDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold text-pink-500 mt-2">
                    <span>Total</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Order;