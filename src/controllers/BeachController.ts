import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import { Beach } from '@src/model/Beach';

@Controller('beaches')
class BeachController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    const beach = new Beach(req.body);
    const result = await beach.save();
    res.status(201).json(result);
  }
}

export default BeachController;
