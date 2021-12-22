import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

import forecastListBeaches from '@test/fixtures/forecast_list_beaches.json';

@Controller('forecast')
class ForecastController {
  @Get('')
  public getForecastForgeLoggedUser(_: Request, res: Response): void {
    res.status(200).json(forecastListBeaches);
  }
}

export default ForecastController;
