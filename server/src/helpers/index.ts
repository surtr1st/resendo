import { ServerResponse } from 'http';

type Headers = {
  contentType:
    | 'application/json'
    | 'multipart/form-data'
    | 'text/plain'
    | 'text/html; charset=utf-8';
  accept: string;
  authorization: string;
  refreshToken: string;
};

type Response = {
  statusCode: number;
  headers: Partial<Headers>;
  data?: unknown;
};

export function useResponse() {
  const handleRequest = (res: ServerResponse) => {
    res.setHeader(
      'Access-Control-Allow-Origin',
      'http://localhost:5173',
      // 'https://resendo-client.netlify.app'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.writeHead(200);
    res.end();
  };

  const onServerResponse =
    ({ statusCode = 100, headers, data }: Response) =>
    (res: ServerResponse) => {
      res.setHeader(
        'Access-Control-Allow-Origin',
        'http://localhost:5173',
        // 'https://resendo-client.netlify.app',
      );
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Authorization',
      );
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      const { contentType, accept, authorization, refreshToken } = headers;
      if (contentType) res.setHeader('Content-Type', contentType);
      if (accept) res.setHeader('Accept', accept);
      if (authorization) res.setHeader('Authorization', authorization);
      if (refreshToken) res.setHeader('Refresh-Token', refreshToken);

      try {
        const body = JSON.stringify(data);
        res.writeHead(statusCode);
        res.write(body);
      } catch (error) {
        console.error('Error serializing response data:', error);
        res.writeHead(500);
        res.write(JSON.stringify({ error: 'Internal Server Error' }));
      }
      res.end();
    };

  return { handleRequest, onServerResponse };
}
