import React from 'react';
import { useSelector } from 'react-redux';
import FoodItem from './FoodItem';

const CartSuggestions = () => {
  const { items } = useSelector((state) => state.cart);
  const { food: { data } } = useSelector((state) => state);

  const getSuggestions = () => {
    if (!data || !items.length) return [];

    // Get categories of items in cart
    const cartCategories = [...new Set(items.map(item => item.category))];
    
    // Get IDs of items already in cart
    const cartItemIds = items.map(item => item._id);
    
    // Find related items from the same categories
    const suggestions = data
      .filter(item => 
        cartCategories.includes(item.category) && 
        !cartItemIds.includes(item._id)
      )
      .slice(0, 3); // Show max 3 suggestions

    return suggestions;
  };

  const suggestions = getSuggestions();

  if (!suggestions.length) return null;

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold text-pink-400 mb-4">
        You might also like...
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((item) => (
          <FoodItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CartSuggestions; 