import { ClassMiddleware, Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

import BaseController from '@src/controllers/BaseController';
import authMiddleware from '@src/middlewares/authMiddleware';
import BeachModel from '@src/models/Beach';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
class BeachController extends BaseController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const beach = new BeachModel({ ...req.body, userId: req.decoded?.id });
      const result = await beach.save();
      res.status(201).send(result);
    } catch (error: any) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}

export default BeachController;
