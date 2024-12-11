const chatbotController = {
  handleMessage: async (req, res) => {
    try {
      const { message } = req.body;
      const lowerMessage = message.toLowerCase();
      
      // Define response patterns
      const responses = {
        menu: "You can explore our full menu in the Explore section. We have a variety of dishes.",
        price: "Our prices range from Rs.100 to Rs.1000. You can check specific prices in the menu.",
        delivery: "We deliver to all major areas. Typical delivery time is 30-45 minutes.",
        payment: "We accept all major credit cards, UPI, and cash on delivery.",
        hours: "We're open from 10 AM to 10 PM, seven days a week.",
        default: "I'm here to help! You can ask about our menu, prices, delivery, payment options, or operating hours."
      };

      // Find appropriate response
      let response = responses.default;
      Object.keys(responses).forEach(key => {
        if (lowerMessage.includes(key)) {
          response = responses[key];
        }
      });

      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Error processing message" });
    }
  }
};

module.exports = chatbotController; 