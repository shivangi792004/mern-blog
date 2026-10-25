import mongoose from 'mongoose';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

const calculateReadTime = (text = '') => {
  const plainText = text.replace(/<[^>]*>/g, ' ');
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
};

const generateUniqueSlug = async (title, currentPostId = null) => {
  let baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!baseSlug) {
    baseSlug = `post-${Date.now().toString(36)}`;
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Post.findOne({ slug });
    if (!existing || (currentPostId && existing._id.toString() === currentPostId.toString())) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields (title and content)'));
  }

  // Graceful offline fallback if MongoDB is not connected
  if (mongoose.connection.readyState !== 1) {
    const slug =
      req.body.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') + `-${Date.now().toString(36)}`;
    const newOfflinePost = {
      _id: `post-${Date.now().toString(36)}`,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || 'architecture',
      image:
        req.body.image ||
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      slug,
      userId: req.user?.id || '654321654321654321654321',
      readTime: calculateReadTime(req.body.content),
      authorName: req.user?.username || 'Shivangi Singh',
      authorAvatar: req.user?.profilePicture || '/shivangi.jpg',
      tags: req.body.tags || [],
      views: 1,
      likes: [],
      numberOfLikes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    REAL_TECHNICAL_BLOGS.unshift(newOfflinePost);
    return res.status(201).json(newOfflinePost);
  }

  try {
    const slug = await generateUniqueSlug(req.body.title);
    const readTime = calculateReadTime(req.body.content);

    // Fetch author profile info
    let authorName = 'Shivangi Singh';
    let authorAvatar = '/shivangi.jpg';

    if (req.user && req.user.id) {
      const author = await User.findById(req.user.id).select('username profilePicture');
      if (author) {
        authorName = author.username || 'Shivangi Singh';
        authorAvatar = author.profilePicture || authorAvatar;
      }
    }

    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
      readTime,
      authorName,
      authorAvatar,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    if (error.code === 11000) {
      try {
        const fallbackSlug = `${req.body.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')}-${Date.now().toString(36)}`;
        const fallbackPost = new Post({
          ...req.body,
          slug: fallbackSlug,
          userId: req.user.id,
          readTime: calculateReadTime(req.body.content),
          authorName: 'Shivangi Singh',
          authorAvatar: '/shivangi.jpg',
        });
        const saved = await fallbackPost.save();
        return res.status(201).json(saved);
      } catch (innerErr) {
        return next(innerErr);
      }
    }
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  const startIndex = parseInt(req.query.startIndex) || 0;
  const limit = parseInt(req.query.limit) || 9;
  const sortParam = req.query.sort || req.query.order;
  const sortDirection = sortParam === 'asc' ? 1 : -1;

  // Resilient offline fallback if database is connecting or offline
  if (mongoose.connection.readyState !== 1) {
    let list = [...REAL_TECHNICAL_BLOGS];
    if (req.query.slug) {
      list = list.filter((p) => p.slug === req.query.slug);
    }
    if (req.query.category && req.query.category !== 'all' && req.query.category !== 'uncategorized') {
      list = list.filter((p) => p.category === req.query.category);
    }
    if (req.query.searchTerm) {
      const q = req.query.searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }
    if (req.query.postId) {
      list = list.filter((p) => p._id === req.query.postId);
    }
    const paginated = list.slice(startIndex, startIndex + limit);
    return res.status(200).json({
      posts: paginated,
      totalPosts: list.length,
      lastMonthPosts: 6,
    });
  }

  try {
    const queryFilter = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && req.query.category !== 'all' && req.query.category !== 'uncategorized' && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.tag && { tags: req.query.tag }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
          { category: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    };

    // If fetching a single post by slug, increment view count
    if (req.query.slug) {
      await Post.findOneAndUpdate(
        { slug: req.query.slug },
        { $inc: { views: 1 } }
      );
    }

    const posts = await Post.find(queryFilter)
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments(queryFilter);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json('The post has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }

  try {
    let updateFields = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      image: req.body.image,
      tags: req.body.tags,
    };

    if (req.body.content) {
      updateFields.readTime = calculateReadTime(req.body.content);
    }

    if (req.body.title) {
      updateFields.slug = await generateUniqueSlug(req.body.title, req.params.postId);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: updateFields },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }

    const userIndex = post.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      post.numberOfLikes += 1;
      post.likes.push(req.user.id);
    } else {
      post.numberOfLikes = Math.max(0, post.numberOfLikes - 1);
      post.likes.splice(userIndex, 1);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

import { REAL_TECHNICAL_BLOGS } from '../data/technicalBlogs.js';
export { REAL_TECHNICAL_BLOGS };

// Ensure slug, _id, authorAvatar, and dates exist on each blog for instant offline and preview fallback
REAL_TECHNICAL_BLOGS.forEach((post, idx) => {
  post.authorAvatar = '/shivangi.jpg';
  post.authorName = 'Shivangi Singh';
  if (!post.slug) {
    post.slug = post.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (!post._id) {
    post._id = `post-seed-${idx + 1}`;
  }
  if (!post.createdAt) {
    post.createdAt = new Date(Date.now() - (idx + 1) * 86400000 * 2).toISOString();
  }
  if (!post.updatedAt) {
    post.updatedAt = new Date().toISOString();
  }
});

// Automated seed check called on server startup or API call
export const seedSamplePosts = async (req, res, next) => {
  try {
    const count = await Post.countDocuments();
    if (count >= 10 && !req.query.force) {
      return res.status(200).json({ message: 'Database already has 10+ posts.', count });
    }

    let defaultUser = await User.findOne({ email: 'shivangisingh8688@gmail.com' });
    if (!defaultUser) {
      const bcryptjs = (await import('bcryptjs')).default;
      const hashedPassword = bcryptjs.hashSync('demo123456', 10);
      defaultUser = await User.create({
        username: 'shivangi',
        email: 'shivangisingh8688@gmail.com',
        password: hashedPassword,
        isAdmin: true,
        profilePicture: '/shivangi.jpg',
        bio: 'Shivangi Singh — B.Tech CSE (2022–2026), Lovely Professional University. Aspiring Software Development Engineer (SDE).',
      });
    }

    for (const post of REAL_TECHNICAL_BLOGS) {
      const slug = await generateUniqueSlug(post.title);
      const { _id, ...postData } = post;
      await Post.findOneAndUpdate(
        { slug },
        {
          ...postData,
          slug,
          userId: defaultUser._id.toString(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Successfully seeded 12 real engineering articles authored by Shivangi Singh!',
      total: REAL_TECHNICAL_BLOGS.length,
    });
  } catch (error) {
    next(error);
  }
};

export const ensureSeedData = async () => {
  try {
    let defaultUser = await User.findOne({ email: 'shivangisingh8688@gmail.com' });
    if (!defaultUser) {
      const bcryptjs = (await import('bcryptjs')).default;
      const hashedPassword = bcryptjs.hashSync('demo123456', 10);
      defaultUser = await User.create({
        username: 'shivangi',
        email: 'shivangisingh8688@gmail.com',
        password: hashedPassword,
        isAdmin: true,
        profilePicture: '/shivangi.jpg',
        bio: 'Shivangi Singh — B.Tech CSE (2022–2026), Lovely Professional University. Aspiring Software Development Engineer (SDE).',
      });
    }
    for (const post of REAL_TECHNICAL_BLOGS) {
      const slug = await generateUniqueSlug(post.title);
      const { _id, ...postData } = post;
      await Post.findOneAndUpdate(
        { title: post.title },
        {
          ...postData,
          slug,
          authorAvatar: '/shivangi.jpg',
          authorName: 'Shivangi Singh',
          userId: defaultUser._id.toString(),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('Synchronized comprehensive engineering publications into MongoDB Atlas!');
  } catch (err) {
    console.warn('Auto-seed notice:', err.message);
  }
};
