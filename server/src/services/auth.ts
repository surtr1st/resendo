import { sign, Secret, SignOptions } from 'jsonwebtoken';

type AuthParams = {
  payload: string | Buffer | object;
  secretOrPrivateKey: Secret;
  options?: SignOptions;
};

export class AuthService {
  createToken({ payload, secretOrPrivateKey, options }: AuthParams) {
    try {
      const token = sign(payload, secretOrPrivateKey, options);
      return token;
    } catch (e) {
      throw new Error('Cannot create token');
    }
  }
}
