import dotenv from 'dotenv';
import { IncomingMessage, ServerResponse } from 'http';
import { useResponse } from '../helpers';
import { AuthService, UserService } from '../services';

export function useAuthController() {
  dotenv.config({});
  const service = new AuthService();
  const userService = new UserService();
  const { onServerResponse } = useResponse();

  const authenticate = (req: IncomingMessage, res: ServerResponse) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('error', (err) => {
      onServerResponse({
        statusCode: 500,
        headers: {
          contentType: 'application/json',
        },
        data: `${err}`,
      })(res);
    });

    req.on('end', async () => {
      const { email } = JSON.parse(body);
      const { JWT_SECRET, REFRESH_SECRET } = process.env;

      const user = await userService.findByEmail(email);
      if (!user) {
        return onServerResponse({
          statusCode: 401,
          headers: {},
          data: 'Unauthorized',
        })(res);
      }

      const accessToken = service.createToken({
        payload: { id: user.id },
        secretOrPrivateKey: JWT_SECRET as string,
        options: { expiresIn: 120 },
      });

      const refreshToken = service.createToken({
        payload: { id: user.id },
        secretOrPrivateKey: REFRESH_SECRET as string,
        options: { expiresIn: 240 },
      });

      onServerResponse({
        statusCode: 200,
        headers: {
          authorization: `Bearer ${accessToken}`,
          refreshToken,
        },
        data: {
          accessToken,
          refreshToken,
          userId: user.id,
        },
      })(res);
    });
  };

  return { authenticate };
}
