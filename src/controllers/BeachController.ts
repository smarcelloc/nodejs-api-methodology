import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('beaches')
class BeachController {
  @Post()
  public async create(req: Request, res: Response): Promise<void> {
    res.status(201).json({ id: 'faker-id', ...req.body });
  }
}

export default BeachController;
