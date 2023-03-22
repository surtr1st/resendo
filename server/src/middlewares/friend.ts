import { Request, Response, NextFunction } from 'express';
import { useResponse } from '../helpers';

const { onServerResponse } = useResponse();

export function validateFriend(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requiredFields = ['friendId'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0)
    onServerResponse({
      statusCode: 406,
      data: '',
    })(res);
  next();
}
