import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import BaseController from '@src/controllers/BaseController';
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
      return res.status(401).send({
        code: 401,
        error: 'User not found!',
      });
    }

    const validatePassword = await AuthService.comparePassword(
      req.body.password,
      user.password || ''
    );

    if (!validatePassword) {
      return res.status(401).send({ code: 401, error: 'Password does not match!' });
    }

    const token = AuthService.generateToken(user.toJSON());

    return res.status(200).send({ ...user.toJSON(), ...{ token } });
  }
}

export default UserController;
