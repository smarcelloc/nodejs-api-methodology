import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import UserModel from '@src/models/User';
@Controller('users')
class UserController {
  @Post()
  public async create(req: Request, res: Response) {
    try {
      const user = new UserModel(req.body);
      const result = await user.save();
      res.status(201).send(result);
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message });
      } else {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }
}

export default UserController;
