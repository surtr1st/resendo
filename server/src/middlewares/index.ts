import { IncomingMessage, ServerResponse } from 'http';

export type MiddlewareFunction = (
  request: IncomingMessage,
  response: ServerResponse,
  next: () => void,
) => void;

export * from './auth';
