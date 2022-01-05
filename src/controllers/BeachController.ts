import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import BaseController from '@src/controllers/BaseController';
import BeachModel from '@src/models/Beach';

@Controller('beaches')
class BeachController extends BaseController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new BeachModel(req.body);
      const result = await beach.save();
      res.status(201).send(result);
    } catch (error: any) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}

export default BeachController;
