import { ServerResponse } from 'http';

type Headers = {
  contentType: string;
  accept: string;
  authorization: string;
  refreshToken: string;
};

type Response = {
  statusCode: number;
  headers: Partial<Headers>;
  data: unknown;
};

export function useResponse() {
  const onServerResponse =
    ({ statusCode = 100, headers, data }: Response) =>
    (res: ServerResponse) => {
      const { contentType, accept, authorization, refreshToken } = headers;
      if (contentType) res.setHeader('Content-Type', contentType);
      if (accept) res.setHeader('Accept', accept);
      if (authorization) res.setHeader('Authorization', authorization);
      if (refreshToken) res.setHeader('Refresh-Token', refreshToken);
      try {
        const body = JSON.stringify(data);
        res.statusCode = statusCode;
        res.write(body);
      } catch (error) {
        console.error('Error serializing response data:', error);
        res.statusCode = 500;
        res.write(JSON.stringify({ error: 'Internal Server Error' }));
      }
      res.end();
    };

  return { onServerResponse };
}
