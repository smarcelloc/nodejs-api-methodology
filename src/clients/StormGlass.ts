import axios, { AxiosRequestConfig, AxiosStatic } from 'axios';
import env from '@src/config/env';
import {
  ForecastPoint,
  StormGlassForecastResponse,
  StormGlassValidatePoint,
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

  constructor(protected request: AxiosStatic = axios) {}

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
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
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

  private isValidPoint(point: Partial<StormGlassValidatePoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.source] &&
      point.swellHeight?.[this.source] &&
      point.swellPeriod?.[this.source] &&
      point.waveDirection?.[this.source] &&
      point.waveHeight?.[this.source] &&
      point.windDirection?.[this.source] &&
      point.windSpeed?.[this.source]
    );
  }
}

export default StormGlass;
