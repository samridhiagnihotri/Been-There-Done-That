import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ChatBubbleOutline, Close } from '@mui/icons-material';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your food assistant. I can help you with:\n\n" +
            "• Menu information 🍽️\n" +
            "• Payment options 💳\n" +
            "• Pricing queries 💰\n" +
            "• Operating hours ⏰\n\n" +
            "What would you like to know about?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const lowerMessage = inputMessage.toLowerCase();
    let botResponse = "I can help you with:\n" +
                     "• Menu information 🍽️\n" +
                     "• Payment options 💳\n" +
                     "• Pricing queries 💰\n" +
                     "• Operating hours ⏰\n\n" +
                     "Please ask about any of these topics!";

    if (lowerMessage.includes('menu') || lowerMessage.includes('categories')) {
      botResponse = "Here's our menu categories:\n\n" +
                    "🍽️ Cold and Hot Beverages:\n" +
                    "🥗 Sides & pasta:\n" +
                    "🍰 Desserts:\n" +
                    "Would you like details about any specific category?";
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      botResponse = "Here's our price range lies between Rs.300 to Rs.1500.";
    }
    
    
    else if (lowerMessage.includes('review')) {
      botResponse = "Customer Reviews & Ratings:\n\n" +
                    "To View Reviews:\n" +
                    "• Click on any menu item\n" +
                    "• Scroll to 'Customer Reviews' section\n" +
                    "• See ratings and detailed feedback\n\n" +
                    "To Add a Review:\n" +
                    "• Go to 'My Orders'\n" +
                    "• Find your completed order\n" +
                    "• Click 'Add Review'\n" +
                    "• Rate (1-5 stars)\n" +
                    "• Share your experience\n\n" +
                    "Would you like to see our top-rated dishes?";
    }
    else if (lowerMessage.includes('payment')) {
      botResponse = "Payment Options Available:\n\n" +
                    "Online Payment:\n" +
                    "• Credit/Debit Cards 💳\n" +
                    "• UPI (All apps supported) 📱\n" +
                    "• Net Banking 🏦\n" +
                    "• Digital Wallets 📲\n\n" +
                    "Offline Payment:\n" +
                    "• Cash on Delivery 💵\n\n" +
                    "Additional Info:\n" +
                    "• Secure payment gateway\n" +
                    "• Split bill option available\n" +
                    "• Digital receipts provided\n\n" +
                    "Need help with a payment issue?";
    }
    else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      botResponse = "I can help you with:\n\n" +
                    "Order Related:\n" +
                    "• Place new order 🛍️\n" +
                    "• Track delivery 🚚\n" +
                    "• Modify order ✏️\n" +
                    "• Cancel order ❌\n\n" +
                    "Payment Related:\n" +
                    "• Payment methods 💳\n" +
                    "• Refund status 💰\n" +
                    "• Bill details 📄\n\n" +
                    "Other Assistance:\n" +
                    "• Menu guidance 📋\n" +
                    "• Special requests 🌟\n" +
                    "• Complaints 📢\n\n" +
                    "What kind of help do you need?";
    }
    else if (lowerMessage.includes('hour') || lowerMessage.includes('timing') || lowerMessage.includes('open')) {
      botResponse = "We're open:\n\n" +
                   "Monday to Sunday: 10 AM - 10 PM\n" +
                   "Kitchen closes at 9:30 PM\n" ;
    }
    else if (lowerMessage.includes('review')) {
      botResponse = "You can:\n\n" +
                   "• Read customer reviews on each item\n" +
                   "• Add your own review after ordering\n" +
                   "• Rate items from 1-5 stars ⭐\n" +
                   "• Share your experience with photos 📸";
    }
    else if (lowerMessage.includes('hi') || 
        lowerMessage.includes('hello') || 
        lowerMessage.includes('hey')) {
      const greetings = [
        "Hi there! How can I help you today? 😊",
        "Hello! Welcome to Bean there, done that! How may I assist you? ☕",
        "Hey! Ready to help you with your coffee needs! 🌟"
      ];
      botResponse = greetings[Math.floor(Math.random() * greetings.length)];
    }
    else if (lowerMessage.includes('bye') || 
        lowerMessage.includes('goodbye') || 
        lowerMessage.includes('see you') || 
        lowerMessage.includes('cya')) {
      botResponse = "Have a nice day! Thank you for chatting with Bean there, done that! 😊";
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
    else if (lowerMessage.includes('delivery')) {
      botResponse = "We offer delivery services. Your order will typically arrive within 30-45 minutes.";
    }
    else if (lowerMessage.includes('payment')) {
      botResponse = "We accept various payment methods including:\n\n" +
                   "• Credit/Debit Cards 💳\n" +
                   "• UPI Payments 📱\n" +
                   "• Cash on Delivery 💵\n" +
                   "• Digital Wallets 📲";
    }
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      botResponse = "Our prices range from Rs.100 to Rs.1000. You can check specific prices in our menu sections.";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 500);
  };

  return (
    <div className={`fixed ${isOpen ? 'bottom-0' : 'bottom-20'} right-4 z-50 transition-all duration-300`}>
      {isOpen && (
        <div className="bg-gray-800 rounded-t-lg shadow-xl w-80 h-96 mb-4">
          <div className="bg-pink-500 rounded-t-lg p-4 flex justify-between items-center">
            <h3 className="text-white font-bold">Food Assistant</h3>
            <Close 
              className="text-white cursor-pointer" 
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div className="p-4 h-72 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div
                  className={`rounded-lg p-2 max-w-[80%] whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-600 text-pink-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 bg-gray-700">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-2 rounded-lg bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </form>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-pink-500 text-white p-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors duration-300 flex items-center gap-2"
      >
        {isOpen ? (
          <Close className="text-xl" />
        ) : (
          <>
            <ChatBubbleOutline className="text-xl" />
            <span className="text-sm font-medium">Food Assistant</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ChatBot; 