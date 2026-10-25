import express from 'express';
import {
  deleteUser,
  getBookmarks,
  getUser,
  getUsers,
  signout,
  test,
  toggleBookmark,
  updateUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.put('/bookmark/:postId', verifyToken, toggleBookmark);
router.get('/bookmarks/all', verifyToken, getBookmarks);
router.get('/:userId', getUser);

export default router;
