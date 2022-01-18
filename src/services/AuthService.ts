import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import env from '@src/config/env';
import { User } from '@src/models/User';

// version of the user that is send to via API and decoded from the Json Web Token
export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
}

class AuthService {
  public async hashPassword(password: string, salt: number | string = 10): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public generateToken(payload: object): string {
    return jwt.sign(payload, env.app.key, {
      expiresIn: env.app.tokenExpiresIn,
    });
  }

  public decodeToken(token: string): DecodedUser {
    return jwt.verify(token, env.app.key) as DecodedUser;
  }
}

export default new AuthService();
