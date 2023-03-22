import { Request, Response, NextFunction } from 'express';
import { useResponse } from '../helpers';

const { onServerResponse } = useResponse();

export function validateGroup(
  req: Request,
  res: Response,
  next: NextFunction,
) {}
