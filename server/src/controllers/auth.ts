import { Request, Response, Router } from 'express';
import { JWT_SECRET, REFRESH_SECRET } from '../config';
import { verifyToken } from '../middlewares';
import { AUTH } from '../routes';
import { AuthService, UserService } from '../services';

export function AuthController() {
  const router = Router();
  const service = new AuthService();
  const userService = new UserService();

  router.post(AUTH, verifyToken, async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await userService.findByEmail(email);
      const accessToken = service.createToken({
        payload: { id: user.id },
        secretOrPrivateKey: JWT_SECRET,
        options: { expiresIn: 120 },
      });

      const refreshToken = service.createToken({
        payload: { id: user.id },
        secretOrPrivateKey: REFRESH_SECRET,
        options: { expiresIn: 240 },
      });

      res.status(200).json({
        accessToken,
        refreshToken,
        userId: user.id,
      });
    } catch (e: Error | unknown) {
      res.status(500).send({
        message: "Email doesn't exist!",
      });
    }
  });

  return router;
}
