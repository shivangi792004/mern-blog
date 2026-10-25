import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: [String],
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: String,
      default: '3 min read',
    },
    authorName: {
      type: String,
      default: 'Shivangi Singh',
    },
    authorAvatar: {
      type: String,
      default: '/shivangi.jpg',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
