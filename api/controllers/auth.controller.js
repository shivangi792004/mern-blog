import mongoose from 'mongoose';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username.trim() === '' ||
    email.trim() === '' ||
    password === ''
  ) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const cleanUsername = username.trim().toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanUsername.length < 3 || cleanUsername.length > 25) {
    return next(errorHandler(400, 'Username must be between 3 and 25 characters'));
  }

  if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
    return next(errorHandler(400, 'Username can only contain letters, numbers, and underscores'));
  }

  if (password.length < 6) {
    return next(errorHandler(400, 'Password must be at least 6 characters'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return next(errorHandler(400, 'Please enter a valid email address'));
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, { username: cleanUsername }],
    });
    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return next(errorHandler(400, 'Email is already registered'));
      }
      return next(errorHandler(400, 'Username is already taken'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'Signup successful! Please sign in.' });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email.trim() === '' || password === '') {
    return next(errorHandler(400, 'All fields are required'));
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    const validUser = await User.findOne({ email: cleanEmail });
    if (!validUser) {
      return next(errorHandler(404, 'User not found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid credentials'));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET || 'personal_blog_super_secret_jwt_key_2025'
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, getCookieOptions())
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    const jwtSecret = process.env.JWT_SECRET || 'personal_blog_super_secret_jwt_key_2025';
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        jwtSecret
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie('access_token', token, getCookieOptions())
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          (name ? name.toLowerCase().replace(/\s+/g, '') : 'user') +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      });
      await newUser.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        jwtSecret
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie('access_token', token, getCookieOptions())
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// 1-Click Demo Login for portfolio reviewers
export const demoLogin = async (req, res, next) => {
  const { role } = req.body; // 'admin' or 'author'
  const isAdmin = role === 'admin';
  const email = isAdmin ? 'shivangi.admin@personalblog.io' : 'shivangisingh8688@gmail.com';
  const username = isAdmin ? 'shivangi_admin' : 'shivangi';

  if (mongoose.connection.readyState !== 1) {
    const mockUser = {
      _id: isAdmin ? '654321654321654321654320' : '654321654321654321654321',
      username,
      email,
      isAdmin,
      profilePicture: '/shivangi.jpg',
      bio: 'Shivangi Singh — B.Tech CSE (2022–2026), Lovely Professional University. Aspiring Software Development Engineer (SDE).',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const jwtSecret = process.env.JWT_SECRET || 'personal_blog_super_secret_jwt_key_2025';
    const token = jwt.sign(
      { id: mockUser._id, isAdmin: mockUser.isAdmin },
      jwtSecret
    );
    return res
      .status(200)
      .cookie('access_token', token, getCookieOptions())
      .json(mockUser);
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = bcryptjs.hashSync('demo123456', 10);
      user = new User({
        username,
        email,
        password: hashedPassword,
        isAdmin: isAdmin,
        profilePicture: '/shivangi.jpg',
        bio: 'Shivangi Singh — B.Tech CSE (2022–2026), Lovely Professional University. Aspiring Software Development Engineer (SDE).',
      });
      await user.save();
    } else if (isAdmin && !user.isAdmin) {
      user.isAdmin = true;
      user.profilePicture = '/shivangi.jpg';
      await user.save();
    }

    const jwtSecret = process.env.JWT_SECRET || 'personal_blog_super_secret_jwt_key_2025';
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      jwtSecret
    );

    const { password, ...rest } = user._doc;
    res
      .status(200)
      .cookie('access_token', token, getCookieOptions())
      .json(rest);
  } catch (error) {
    next(error);
  }
};
