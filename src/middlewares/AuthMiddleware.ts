import { NextFunction, Request, Response } from 'express';

import AuthService from '@src/services/AuthService';

const AuthMiddleware = (
  req: Partial<Request>,
  res: Partial<Response>,
  next: NextFunction
): void => {
  try {
    const token = req.headers?.['x-access-token'];

    const decoded = AuthService.decodeToken(token as string);
    req.decoded = decoded;
    next();
  } catch (error: any) {
    if (error instanceof Error) {
      res.status?.(401).send({ code: 401, error: error.message });
    } else {
      res.status?.(401).send({ code: 401, error: 'Unknown auth error' });
    }
  }
};

export default AuthMiddleware;
