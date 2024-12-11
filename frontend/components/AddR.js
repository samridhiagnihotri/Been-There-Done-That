import React, { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const AddReview = ({ foodItemId, onReviewAdded }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        enqueueSnackbar('Please login to submit a review', { variant: 'warning' });
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/${foodItemId}`,
        { rating, comment },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        enqueueSnackbar('Review submitted successfully!', { variant: 'success' });
        setShowForm(false);
        setComment('');
        setRating(1);
        if (onReviewAdded) onReviewAdded();
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to submit review', { 
        variant: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-pink-400 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`p-2 rounded-full transition-colors ${
                      rating >= value ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-pink-400 mb-2">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-100 focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                rows="4"
                placeholder="Share your thoughts about this item..."
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 text-gray-400 hover:text-pink-400"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 bg-gray-700/50 text-pink-400 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Write a Review
        </button>
      )}
    </div>
  );
};

export default AddReview;
