import dotenv from 'dotenv';
import { verify } from 'jsonwebtoken';
import { IncomingMessage, ServerResponse } from 'http';
import { MiddlewareFunction } from '.';
import { UserService } from '../services';
import { ObjectId } from 'mongoose';
import { useResponse } from '../helpers';

dotenv.config({});
const { JWT_SECRET } = process.env;
const { onServerResponse } = useResponse();

export const verifyToken: MiddlewareFunction = async (
  req: IncomingMessage,
  res: ServerResponse,
  next: (fn?: () => void) => void,
) => {
  const service = new UserService();
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    next();
    return;
  }
  if (token) {
    try {
      const decoded = verify(token, JWT_SECRET as string) as {
        id: string | ObjectId;
      };
      const user = await service.findById(decoded.id);
      if (!user)
        return onServerResponse({
          statusCode: 401,
          headers: {
            contentType: 'application/json',
          },
          data: 'Unauthorized',
        })(res);

      next();
      return;
    } catch (err) {
      return onServerResponse({
        statusCode: 401,
        headers: {
          contentType: 'application/json',
        },
        data: 'Unauthorized',
      })(res);
    }
  }
};
