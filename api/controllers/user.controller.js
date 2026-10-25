import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';

export const test = (req, res) => {
  res.json({ message: 'Personal Blog API is fully operational!' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }

  let updateFields = {};

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    updateFields.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    const cleanUsername = req.body.username.trim().toLowerCase();
    if (cleanUsername.length < 3 || cleanUsername.length > 25) {
      return next(
        errorHandler(400, 'Username must be between 3 and 25 characters')
      );
    }
    if (cleanUsername.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return next(
        errorHandler(400, 'Username can only contain letters, numbers, and underscores')
      );
    }
    updateFields.username = cleanUsername;
  }

  if (req.body.email) {
    const cleanEmail = req.body.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return next(errorHandler(400, 'Please enter a valid email address'));
    }
    updateFields.email = cleanEmail;
  }

  if (req.body.profilePicture) {
    updateFields.profilePicture = req.body.profilePicture;
  }

  if (req.body.bio !== undefined) {
    updateFields.bio = req.body.bio;
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to see all users'));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Bookmarking / Reading List
export const toggleBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return next(errorHandler(404, 'User not found'));

    const postId = req.params.postId;
    const isBookmarked = user.bookmarks.some((b) => b.toString() === postId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((b) => b.toString() !== postId);
    } else {
      user.bookmarks.push(postId);
    }

    await user.save();
    res.status(200).json({
      isBookmarked: !isBookmarked,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarks');
    if (!user) return next(errorHandler(404, 'User not found'));

    res.status(200).json(user.bookmarks || []);
  } catch (error) {
    next(error);
  }
};
