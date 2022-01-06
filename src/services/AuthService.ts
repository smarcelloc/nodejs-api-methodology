import bcrypt from 'bcrypt';

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
}

export default new AuthService();
