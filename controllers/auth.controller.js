import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // ✅ allow ONLY renter or owner
  if (role && !['renter', 'owner'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role selection' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'renter', // fallback to renter
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

// backend/controllers/auth.controller.js
// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user and EXPLICITLY ask for the password field
    // Because we set 'select: false' in the model, we use '+password'
    const user = await User.findOne({ email }).select('+password');

    // 2. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // 3. Use 401 (Unauthorized) for wrong credentials, not 500
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    // 4. Catch any unexpected errors to prevent the 500 crash
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
// Get user profile
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
