import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  create,
  deletepost,
  getposts,
  likePost,
  seedSamplePosts,
  updatepost,
} from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getposts', getposts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletepost);
router.put('/updatepost/:postId/:userId', verifyToken, updatepost);
router.put('/like/:postId', verifyToken, likePost);
router.post('/seed', seedSamplePosts);

export default router;