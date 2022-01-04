import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

import { Beach } from '@src/model/Beach';
import ForecastService from '@src/services/ForecastService';

const forecastService = new ForecastService();

@Controller('forecast')
class ForecastController {
  @Get('')
  public async getForecastForgeLoggedUser(
    _: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({});
      const forecastData = await forecastService.processForecastForBeaches(
        beaches
      );
      res.status(200).send(forecastData);
    } catch (error: any) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}

export default ForecastController;
