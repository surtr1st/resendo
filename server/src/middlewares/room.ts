import { Request, Response, NextFunction } from 'express';
import { useResponse } from '../helpers';

const { onServerResponse } = useResponse();

export function validateRoom(req: Request, res: Response, next: NextFunction) {
  const requiredFields = ['userId', 'partnerId'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0)
    onServerResponse({
      statusCode: 406,
      data: '',
    })(res);
  next();
}

export function validateUpdateRoom(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requiredFields = ['roomId', 'messageId'];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0)
    onServerResponse({
      statusCode: 406,
      data: '',
    })(res);
  next();
}
