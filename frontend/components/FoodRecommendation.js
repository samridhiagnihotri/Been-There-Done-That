import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import Image from 'next/image';
import { useSnackbar } from 'notistack';

const FoodRecommendationItem = ({ item }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // Handle price format from MongoDB
  const price = typeof item.price === 'object' && item.price.$numberDecimal
    ? parseFloat(item.price.$numberDecimal)
    : typeof item.cost === 'object' && item.cost.$numberDecimal
      ? parseFloat(item.cost.$numberDecimal)
      : parseFloat(item.price || item.cost || 0);

  const handleAddToCart = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login to add items to cart', { variant: 'warning' });
        return;
      }

      dispatch(addToCart({
        _id: item._id,
        name: item.name,
        price: price,
        image: item.image,
        category: item.category,
        quantity: 1,
        total: price
      }));
      enqueueSnackbar('Item added to cart!', { variant: 'success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      enqueueSnackbar('Failed to add item to cart', { variant: 'error' });
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-gray-700 rounded-lg p-3">
      <div className="relative w-20 h-20">
        <Image
          src={item.image}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
          unoptimized
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-white font-medium">{item.name}</h3>
        <p className="text-gray-300 text-sm">₹{price.toFixed(2)}</p>
      </div>
      <button
        onClick={handleAddToCart}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Add
      </button>
    </div>
  );
};

const FoodRecommendation = ({ recommendations, loading }) => {
  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-pink-500 mb-4">Recommended for You</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-pink-500 mb-4">Recommended for You</h2>
      <div className="space-y-4">
        {recommendations.map((item) => (
          <FoodRecommendationItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FoodRecommendation;
