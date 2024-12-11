// require("dotenv").config();
const Users = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValid, loginValid } = require("../utils/errorHandler");

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password, cf_password } = req.body;
      
      const errorMessage = registerValid(name, email, password, cf_password);
      if (errorMessage) {
        return res.status(400).json({ 
          success: false, 
          message: errorMessage 
        });
      }
      
      const existingUser = await Users.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already registered" 
        });
      }
      
      const newUser = new Users({ 
        name, 
        email, 
        password,
        role: "user" 
      });
      
      await newUser.save();
      
      res.status(201).json({ 
        success: true, 
        message: "Registration successful!" 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server error: " + error.message 
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      const errorMessage = loginValid(email, password);
      if (errorMessage) {
        return res.status(400).json({ 
          success: false, 
          message: errorMessage 
        });
      }

      // Find user and explicitly include password
      const user = await Users.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password' 
        });
      }

      // Use the matchPassword method from the user model
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false,
          message: 'Invalid email or password' 
        });
      }

      // Update last login time
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(200).json({
        success: true,
        token,
        user: userResponse
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Server error during login' 
      });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Logout error:", error.stack);
      res.status(500).json({ message: "Server error: " + error.message });
    }
  },

  verifyToken: async (req, res) => {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized access" });

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || Date.now() >= decoded.exp * 1000) {
          return res.status(401).json({ message: "Token expired" });
        }
        res.status(200).json({ message: "Token is valid", user: decoded });
      });
    } catch (error) {
      console.error("Token verification error:", error.stack);
      res.status(500).json({ message: "Server error: " + error.message });
    }
  },
};

module.exports = authController;
