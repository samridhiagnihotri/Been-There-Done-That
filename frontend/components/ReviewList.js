import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const ReviewList = ({ foodItemId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/${foodItemId}`);
        setReviews(Array.isArray(response.data) ? response.data : response.data.reviews || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError(error.message);
        enqueueSnackbar('Failed to load reviews', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [foodItemId, enqueueSnackbar]);

  if (loading) return (
    <div className="flex justify-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-400 p-4 text-center bg-red-100/10 rounded-lg">
      {error}
    </div>
  );

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-300">
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="bg-gray-700/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-pink-400">{review.userId?.name || 'Anonymous'}</span>
                {review.isVerifiedPurchase && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Verified Purchase
                  </span>
                )}
              </div>
              <span className="text-gray-400 text-sm">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-300 break-words">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;