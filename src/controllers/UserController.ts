import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import UserModel from '@src/models/User';

@Controller('users')
class UserController {
  @Post()
  public async create(req: Request, res: Response) {
    const user = new UserModel(req.body);
    const result = await user.save();
    res.status(201).send(result);
  }
}

export default UserController;
