/* eslint-disable no-unused-vars */
import StormGlass, { ForecastPoint } from '@src/clients/StormGlass';
import { BeachType } from '@src/model/Beach';
import InternalError from '@src/util/errors/InternalError';

export interface BeachForecast extends BeachType, ForecastPoint {}

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
  constructor(private stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: BeachType[]
  ): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = [];
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        pointsWithCorrectSources.push(...this.enrichBeachData(points, beach));
      }

      const forecastByTime: TimeForecast[] = [];
      for (const point of pointsWithCorrectSources) {
        forecastByTime.push(this.mapForecastByTime(point));
      }

      return forecastByTime;
    } catch (error: any) {
      throw new ForecastProcessingInternalError(error.message);
    }
  }

  private enrichBeachData(
    points: ForecastPoint[],
    beach: BeachType
  ): BeachForecast[] {
    return points.map((point) => ({
      lat: beach.lat,
      lng: beach.lng,
      name: beach.name,
      position: beach.position,
      rating: 1, // need to be implemented
      ...point,
    }));
  }

  private mapForecastByTime(point: BeachForecast): TimeForecast {
    return {
      time: point.time,
      forecast: [point],
    };
  }
}

export default ForecastService;
