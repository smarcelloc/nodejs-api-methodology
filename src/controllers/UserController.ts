import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { User } from '@src/models/User';

@Controller('users')
class UserController {
  @Post()
  public async create(req: Request, res: Response) {
    const user = new User(req.body);
    const result = await user.save();
    res.status(201).send(result);
  }
}

export default UserController;
