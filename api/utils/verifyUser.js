import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return next(errorHandler(401, 'Unauthorized: Please sign in to perform this action'));
  }

  const jwtSecret = process.env.JWT_SECRET || 'personal_blog_super_secret_jwt_key_2025';

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return next(errorHandler(401, 'Unauthorized: Session expired or invalid token'));
    }
    req.user = user;
    next();
  });
};
