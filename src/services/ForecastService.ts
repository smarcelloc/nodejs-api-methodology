import StormGlass, { ForecastPoint } from '@src/clients/StormGlass';
import { Beach } from '@src/models/Beach';
import RatingService from '@src/services/RatingService';
import InternalError from '@src/util/errors/InternalError';
import logger from '@src/util/logger';

export interface BeachForecast extends Omit<Beach, 'userId'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

class ForecastService {
  constructor(
    protected stormGlass = new StormGlass(),
    protected Rating: typeof RatingService = RatingService
  ) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    logger.info(`Preparing the forecast for ${beaches.length} beaches`);
    try {
      for (const beach of beaches) {
        const rating = new this.Rating(beach);
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedBeachData = this.enrichBeachData(points, beach, rating);
        pointsWithCorrectSources.push(...enrichedBeachData);
      }
      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingInternalError((error as Error).message);
    }
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }

  private enrichBeachData(
    points: ForecastPoint[],
    beach: Beach,
    rating: RatingService
  ): BeachForecast[] {
    return points.map((point) => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point),
      },
      ...point,
    }));
  }
}

export default ForecastService;
