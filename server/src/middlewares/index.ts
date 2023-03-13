import { IncomingMessage, ServerResponse } from 'http';

export type NextFunction = (
  request: IncomingMessage,
  response: ServerResponse,
) => void;

export type MiddlewareFunction = (
  request: IncomingMessage,
  response: ServerResponse,
  next: NextFunction,
) => void;

export * from './auth';
export * from './user';
