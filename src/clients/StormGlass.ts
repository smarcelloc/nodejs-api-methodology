import { AxiosRequestConfig, AxiosStatic } from 'axios';
import env from '@src/config/env';
import {
  ForecastPoint,
  StormGlassForecastResponse,
} from './StormGlassInterface';

class StormGlass {
  readonly uri = env.stormGlass.uri;
  readonly source = env.stormGlass.source;
  readonly params = env.stormGlass.params;
  readonly key = env.stormGlass.key;

  readonly requestConfig: AxiosRequestConfig = {
    headers: {
      Authorization: this.key,
    },
  };

  constructor(protected request: AxiosStatic) {}

  public async featchPoints(
    latitude: number,
    longitude: number
  ): Promise<ForecastPoint[]> {
    const url = `${this.uri}/weather/point?lat=${latitude}&lng=${longitude}&params=${this.params}&source=${this.source}`;
    const response = await this.request.get<StormGlassForecastResponse>(
      url,
      this.requestConfig
    );

    const responseNormalized = this.normalizeResponse(response.data);

    return Promise.resolve(responseNormalized);
  }

  private normalizeResponse(
    points: StormGlassForecastResponse
  ): ForecastPoint[] {
    return points.hours.map((point) => ({
      time: point.time,
      swellDirection: point.swellDirection[this.source],
      swellHeight: point.swellHeight[this.source],
      swellPeriod: point.swellPeriod[this.source],
      waveDirection: point.waveDirection[this.source],
      waveHeight: point.waveHeight[this.source],
      windDirection: point.windDirection[this.source],
      windSpeed: point.windSpeed[this.source],
    }));
  }
}

export default StormGlass;
