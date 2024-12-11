import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function OrderConfirmation() {
  const router = useRouter();
  const { method } = router.query;

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          {method === 'cod' 
            ? 'Your order will be delivered soon. Please keep cash ready at the time of delivery.'
            : 'Your payment has been processed successfully. Your order will be delivered soon.'}
        </p>
        <button
          onClick={() => router.push('/orders')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Orders
        </button>
      </div>
    </div>
  );
} 