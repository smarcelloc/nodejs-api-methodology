import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import BeachModel from '@src/models/Beach';

@Controller('beaches')
class BeachController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new BeachModel(req.body);
      const result = await beach.save();
      res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).send({ error: error.message });
      } else {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  }
}

export default BeachController;
