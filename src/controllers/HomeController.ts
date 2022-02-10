import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('')
class HomeController {
  @Get()
  public index(req: Request, res: Response): void {
    res.status(200).send({
      name: 'API Surf',
      description: 'API to calculate the best surf condition among several beaches',
      version: 1,
    });
  }
}

export default HomeController;
