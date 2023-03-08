import { ServerResponse } from 'http';

type Headers = {
  contentType: string;
  accept: string;
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
      const { contentType, accept } = headers;
      if (contentType) res.setHeader('Content-Type', contentType);
      if (accept) res.setHeader('Accept', accept);
      res.statusCode = statusCode;
      try {
        const body = JSON.stringify(data);
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
