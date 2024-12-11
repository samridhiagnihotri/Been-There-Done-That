import React from 'react';
import { useSelector } from 'react-redux';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';

const CartIcon = () => {
  const { items } = useSelector((state) => state.cart);
  
  // Calculate total quantity across all items
  const totalQuantity = items.reduce((total, item) => {
    return total + (item.quantity || 1);
  }, 0);

  return (
    <Link href="/cart">
      <div className="relative inline-block cursor-pointer">
        <ShoppingCartIcon className="text-pink-400 hover:text-pink-300 transition-colors w-6 h-6" />
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {totalQuantity}
          </span>
        )}
      </div>
    </Link>
  );
};

export default CartIcon; 