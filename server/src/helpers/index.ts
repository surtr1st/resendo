import { Response as ExpressResponse } from 'express';

type Response = {
  statusCode: number;
  data?: unknown;
};

export function useResponse() {
  const onServerResponse =
    ({ statusCode = 100, data }: Response) =>
    (res: ExpressResponse) => {
      try {
        return res.status(statusCode).json(data);
      } catch (error) {
        console.error('Error serializing response data:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    };
  return { onServerResponse };
}
