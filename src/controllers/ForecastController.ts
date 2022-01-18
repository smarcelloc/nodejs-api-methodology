import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

import AuthMiddleware from '@src/middlewares/AuthMiddleware';
import BeachModel from '@src/models/Beach';
import ForecastService from '@src/services/ForecastService';

const forecastService = new ForecastService();

@Controller('forecast')
@ClassMiddleware(AuthMiddleware)
class ForecastController {
  @Get('')
  public async getForecastForgeLoggedUser(
    _: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await BeachModel.find();
      const forecastData = await forecastService.processForecastForBeaches(
        beaches
      );
      res.status(200).send(forecastData);
    } catch (error: any) {
      res.status(500).send({ code: 500, error: 'Internal Server Error' });
    }
  }
}

export default ForecastController;
