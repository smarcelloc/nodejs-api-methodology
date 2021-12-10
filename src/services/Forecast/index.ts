import StormGlass from '@src/clients/StormGlass';
import { ForecastPoint } from '@src/clients/StormGlass/interfaces';
import { Beach, BeachForecast, TimeForecast } from './interface';

class ForecastService {
  constructor(private stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
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
  }

  private enrichBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
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
