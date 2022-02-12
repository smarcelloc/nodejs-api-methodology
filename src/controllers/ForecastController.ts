import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

import BaseController from '@src/controllers/BaseController';
import AuthMiddleware from '@src/middlewares/AuthMiddleware';
import BeachModel from '@src/models/Beach';
import ForecastService from '@src/services/ForecastService';
import logger from '@src/util/logger';

const forecastService = new ForecastService();

@Controller('forecast')
@ClassMiddleware(AuthMiddleware)
class ForecastController extends BaseController {
  @Get()
  public async getForecastForgeLoggedUser(_: Request, res: Response): Promise<void> {
    try {
      const beaches = await BeachModel.find();
      const forecastData = await forecastService.processForecastForBeaches(beaches);
      res.status(200).send(forecastData);
    } catch (error: any) {
      logger.error(error);
      this.sendErrorResponse(res, { code: 500, message: 'Internal Server Error' });
    }
  }
}

export default ForecastController;
