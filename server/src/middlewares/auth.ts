import dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services';
import { ObjectId } from 'mongoose';

dotenv.config({});
const { JWT_SECRET } = process.env;

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const service = new UserService();
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next();
  if (token) {
    try {
      const decoded = verify(token, JWT_SECRET as string) as {
        id: string | ObjectId;
      };
      const user = await service.findById(decoded.id);
      if (!user) res.status(401).send('Unauthorized');
      return next();
    } catch (err) {
      res.status(401).send('Unauthorized');
    }
  }
}
