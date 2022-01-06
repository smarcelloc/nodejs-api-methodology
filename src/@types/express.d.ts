import { DecodedUser } from '@src/services/AuthService';
import { Request as Express } from 'express';

declare module 'express-serve-static-core' {
  interface Request extends Express {
    decoded?: DecodedUser;
  }
}
