const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/);
};

const registerValid = (name, email, password, cf_password) => {
  // Check if the name starts with an alphabet
  if (!name) return "Please enter your name";
  if (!/^[A-Za-z]/.test(name)) return "Name must start with an alphabet";
  
  // Email validation
  if (!email) return "Please enter your email address";
  if (!validateEmail(email)) return "Please enter a valid email";
  
  // Password validation
  if (!password) return "Please enter a new password";
  if (password.length < 6) return "Password should contain at least 6 characters";

  const passwordValid = 
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!passwordValid) {
    return "Password must include at least one uppercase letter, one digit, and one special character.";
  }

  // Confirm password
  if (!cf_password) return "Please retype your password to confirm";
  if (password !== cf_password) return "Passwords do not match. Please try again";

  return null; // No error
};

const loginValid = (email, password) => {
  if (!email || !password) {
    return "Please provide both email and password";
  }
    
  if (!validateEmail(email)) {
    return "Please enter a valid email address";
  }
    
  return null; // Remove password length check for login
};

const addFoodErrorHandler = (name, category, cost, description, image) => {
  if (!name) return "Please enter the food name";
  if (!category) return "Please enter the food category";
  if (!cost) return "Please enter the food cost";
  if (!description) return "Please enter the food description";
  if (!image) return "Please add a food image";
  
  return null; // No error
};

const makeOrderErrorHandler = (name, email, foodName, address) => {
  if (!name) return "Please enter your name";
  if (!email) return "Please enter your email";
  if (!foodName) return "Food name is required";
  if (!address) return "Please enter your address";
  
  return null; // No error
};

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = {
  registerValid,
  loginValid,
  addFoodErrorHandler,
  makeOrderErrorHandler,
  validateEmail,
  ErrorHandler,
};
