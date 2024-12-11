import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PaymentMethodSelector from '../components/PaymentMethodSelector';

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch cart items from your state management or local storage
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartItems);
    setLoading(false);
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePaymentSuccess = async (data) => {
    try {
      // Save order to database
      const orderData = {
        items: cart,
        totalAmount: calculateTotal(),
        paymentMethod: data.paymentMethod,
        paymentId: data.razorpay_payment_id, // Only for online payments
        status: data.paymentMethod === 'cod' ? 'pending' : 'paid'
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Clear cart
        localStorage.removeItem('cart');
        router.push(`/order-confirmation?method=${data.paymentMethod}`);
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const handlePaymentFailure = (error) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="font-semibold">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between">
                <span className="font-semibold">Total Amount:</span>
                <span className="font-bold">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <PaymentMethodSelector
            amount={calculateTotal()}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
        </div>
      </div>
    </div>
  );
} 