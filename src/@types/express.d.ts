import { DecodedUser } from '@src/services/AuthService';

declare module 'express-serve-static-core' {
  interface Request {
    decoded?: DecodedUser;
  }
}
