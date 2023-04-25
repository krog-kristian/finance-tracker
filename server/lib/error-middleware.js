import jwt from 'jsonwebtoken';
import ClientError from './client-error.js';

export default function errorMiddleware(err, req, res, next) {
  if (err instanceof ClientError) return res.status(err.status).json({ error: err.message });
  if (err instanceof jwt.JsonWebTokenError) return res.status(401).json({ error: 'invalid access token' });
  if (err.code === '23505') return res.status(403).json({ error: 'Username already exists!' });
  console.error(err);
  res.status(500).json({ error: 'an unexpected error occurred' });
}
