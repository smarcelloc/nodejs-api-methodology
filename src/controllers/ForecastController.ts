import { ClassMiddleware, Controller, Get, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

import BaseController from '@src/controllers/BaseController';
import AuthMiddleware from '@src/middlewares/AuthMiddleware';
import BeachModel from '@src/models/Beach';
import ForecastService from '@src/services/ForecastService';
import ApiError from '@src/util/errors/ApiError';
import logger from '@src/util/logger';

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute in milliseconds
  max: 10,
  keyGenerator(req: Request): string {
    return req.ip;
  },
  handler(_, res: Response): void {
    res.status(429).send(
      ApiError.format({
        code: 429,
        message: "Too many requests to the '/forecast endpoint'",
      })
    );
  },
});

const forecastService = new ForecastService();

@Controller('forecast')
@ClassMiddleware(AuthMiddleware)
class ForecastController extends BaseController {
  @Get()
  @Middleware(rateLimiter)
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
