import express from 'express';
import { UserService } from '../services/UserService';
import { authenticateToken } from '../middleware/auth';
import { UserRole } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
const userService = new UserService();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userService.createUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt for username:', username);
    
    const user = await userService.findByUsername(username);
    console.log('Found user:', user);
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isValid);
    
    if (!isValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    console.log('Generated token for user:', username);
    res.json({ 
      token, 
      user: { 
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Get profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.username) {
      console.log('No user in request');
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('Profile request for user:', req.user.username);
    const user = await userService.findByUsername(req.user.username);
    
    if (!user) {
      console.log('User not found in profile request');
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Found user for profile:', user.username);
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    console.log('Sending user response:', userResponse);
    res.json(userResponse);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user || !req.user.role) {
      console.log('No user role in request');
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('User role:', req.user.role);
    if (req.user.role !== UserRole.ADMIN) {
      console.log('Unauthorized access attempt to /users by non-admin user');
      return res.status(403).json({ message: 'Unauthorized - Admin access required' });
    }
    
    console.log('Admin user requesting all users');
    const users = await userService.getAllUsers();
    console.log('Found users:', users.length);
    
    if (!users || users.length === 0) {
      console.log('No users found in database');
      return res.json({ users: [] });
    }
    
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;

