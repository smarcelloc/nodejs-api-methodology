import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import BaseController from '@src/controllers/BaseController';
import UserModel from '@src/models/User';

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
}

export default UserController;
