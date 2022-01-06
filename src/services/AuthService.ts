import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import env from '@src/config/env';

class AuthService {
  public async hashPassword(
    password: string,
    salt: number | string = 10
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public generateToken(payload: object): string {
    return jwt.sign(payload, env.app.key, {
      expiresIn: env.app.tokenExpiresIn,
    });
  }
}

export default new AuthService();
