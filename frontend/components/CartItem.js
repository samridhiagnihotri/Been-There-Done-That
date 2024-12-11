import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeFromCart } from '../redux/slices/cartSlice';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import FoodItem from './FoodItem';

const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { food: { data } } = useSelector((state) => state);

  // Handle price format from MongoDB
  const price = typeof item.price === 'object' && item.price.$numberDecimal 
    ? parseFloat(item.price.$numberDecimal)
    : parseFloat(item.price);

  // Calculate total
  const total = price * quantity;

  // Update cart when quantity changes
  useEffect(() => {
    const updatedItem = {
      ...item,
      quantity,
      total: price * quantity
    };
    dispatch(updateCartItem(updatedItem));
  }, [quantity]); // Only depend on quantity changes

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    
    if (newQuantity > 10) {
      enqueueSnackbar('Maximum 10 items allowed per order', { variant: 'warning' });
      return;
    }

    setQuantity(newQuantity);
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item._id));
    enqueueSnackbar('Item removed from cart', { variant: 'success' });
  };

  const getSuggestions = () => {
    if (!data || !item.category) return [];
    return data
      .filter(food => 
        food.category === item.category && 
        food._id !== item._id
      )
      .slice(0, 2);
  };

  return (
    <div className="group">
      <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700/80 transition-colors">
        {/* Item Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Item Details */}
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-pink-100">{item.name}</h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              <p className="text-pink-400 font-medium">
                ₹{price.toFixed(2)} x {quantity}
              </p>
              <p className="text-pink-500 font-bold">
                Total: ₹{total.toFixed(2)}
              </p>
            </div>
            
            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-1">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-1 text-pink-400 hover:text-pink-300 transition-colors"
                disabled={quantity <= 1}
              >
                <Remove className={`w-5 h-5 ${quantity <= 1 ? 'opacity-50' : ''}`} />
              </button>
              <span className="text-white font-medium min-w-[20px] text-center">
                {quantity}
              </span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-1 text-pink-400 hover:text-pink-300 transition-colors"
                disabled={quantity >= 10}
              >
                <Add className={`w-5 h-5 ${quantity >= 10 ? 'opacity-50' : ''}`} />
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="ml-4 p-2 text-pink-400 hover:text-pink-300 transition-colors"
              aria-label="Remove item"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {getSuggestions().length > 0 && (
        <div className="mt-3 pl-4">
          <div className="text-sm text-gray-400 mb-2">You might also like:</div>
          <div className="grid grid-cols-2 gap-4">
            {getSuggestions().map(suggestion => (
              <FoodItem 
                key={suggestion._id} 
                food={suggestion}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
