import StormGlass from '@src/clients/StormGlass';
import { ForecastPoint } from '@src/clients/StormGlass/interfaces';
import { Beach, BeachForecast } from './interface';

class ForecastService {
  constructor(private stormGlass: StormGlass) {}

  public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];

    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      pointsWithCorrectSources.push(...this.enrichBeachData(points, beach));
    }

    return pointsWithCorrectSources;
  }

  private enrichBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[] {
    return points.map((element) => ({
      lat: beach.lat,
      lng: beach.lng,
      name: beach.name,
      position: beach.position,
      rating: 1, // need to be implemented
      ...element,
    }));
  }
}

export default ForecastService;
