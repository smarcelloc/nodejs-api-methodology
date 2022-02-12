import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '@src/models/User';
import config, { IConfig } from '@src/util/config';

// version of the user that is send to via API and decoded from the Json Web Token
export interface DecodedUser extends Omit<User, '_id'> {
  id: string;
}

const authConfig: IConfig = config.get('App.auth');

class AuthService {
  public async hashPassword(password: string, salt: number | string = 10): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public generateToken(payload: object): string {
    return jwt.sign(payload, authConfig.get('key'), {
      expiresIn: authConfig.get('tokenExpiresIn'),
    });
  }

  public decodeToken(token: string): DecodedUser {
    return jwt.verify(token, authConfig.get('key')) as DecodedUser;
  }
}

export default new AuthService();
