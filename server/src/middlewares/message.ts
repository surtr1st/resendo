import { MiddlewareFunction } from '.';
import { IncomingMessage, ServerResponse } from 'http';
import { useResponse } from '../helpers';

const { onServerResponse } = useResponse();

export const validateMessageUndefined: MiddlewareFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) => {
  try {
    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk;
    });

    req.on('error', (err) => {
      return onServerResponse({
        statusCode: 500,
        headers: { contentType: 'application/json' },
        data: err,
      })(res);
    });

    req.on('end', () => {
      const requiredFields = ['userId', 'content'];
      const missingFields = requiredFields.filter(
        (field) => !JSON.parse(requestBody)[field],
      );

      if (missingFields.length > 0) {
        return onServerResponse({
          statusCode: 406,
          headers: { contentType: 'application/json' },
          data: '',
        })(res);
      }

      next();
    });
  } catch (e) {
    return onServerResponse({
      statusCode: 500,
      headers: { contentType: 'application/json' },
      data: 'Unknown error has occur',
    })(res);
  }
};
