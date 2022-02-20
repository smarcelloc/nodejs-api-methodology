import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import BaseController from '@src/controllers/BaseController';
import AuthMiddleware from '@src/middlewares/AuthMiddleware';
import UserModel from '@src/models/User';
import AuthService from '@src/services/AuthService';

@Controller('users')
class UserController extends BaseController {
  @Post()
  public async create(req: Request, res: Response) {
    try {
      const user = new UserModel(req.body);
      const result = await user.save();
      res.status(201).send(result);
    } catch (error: any) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticated(req: Request, res: Response) {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return this.sendErrorResponse(res, { code: 401, message: 'User not found!' });
    }

    const validatePassword = await AuthService.comparePassword(
      req.body.password,
      user.password || ''
    );

    if (!validatePassword) {
      return this.sendErrorResponse(res, { code: 401, message: 'Password does not match!' });
    }

    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ ...user.toJSON(), ...{ token } });
  }

  @Get('me')
  @Middleware(AuthMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const email = req.decoded ? req.decoded.email : undefined;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!',
      });
    }

    return res.send({ user });
  }
}

export default UserController;
