import env from '@src/config/env';
import * as HTTPUtil from '@src/util/request';

import { ClientRequestError, StormGlassResponseError } from './error';
import {
  ForecastPoint,
  StormGlassForecastResponse,
  StormGlassValidatePoint,
} from './interfaces';

class StormGlass {
  readonly uri = env.stormGlass.uri;
  readonly source = env.stormGlass.source;
  readonly params = env.stormGlass.params;
  readonly key = env.stormGlass.key;

  readonly requestConfig: HTTPUtil.RequestConfig = {
    headers: {
      Authorization: this.key,
    },
  };

  constructor(protected request = new HTTPUtil.Request()) {}

  public async fetchPoints(
    latitude: number,
    longitude: number
  ): Promise<ForecastPoint[]> {
    try {
      const url = `${this.uri}/weather/point?lat=${latitude}&lng=${longitude}&params=${this.params}&source=${this.source}`;
      const response = await this.request.get<StormGlassForecastResponse>(
        url,
        this.requestConfig
      );

      const responseNormalized = this.normalizeResponse(response.data);

      return Promise.resolve(responseNormalized);
    } catch (error: any) {
      if (HTTPUtil.Request.isRequestError(error)) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(error.response.data)} Code: ${
            error.response.status
          }`
        );
      }

      throw new ClientRequestError(error.message);
    }
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
