import { Request, Response, NextFunction } from 'express';
import { useResponse } from '../helpers';

const { onServerResponse } = useResponse();

export function validateMedia(
  req: Request,
  res: Response,
  next: NextFunction,
) {}
