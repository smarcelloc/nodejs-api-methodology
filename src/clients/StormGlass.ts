import { AxiosRequestConfig, AxiosStatic } from 'axios';
import env from '@src/config/env';

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

  public featchPoints(latitude: number, longitude: number): Promise<{}> {
    const url = `${this.uri}/weather/point?lat=${latitude}&lng=${longitude}&params=${this.params}&source=${this.source}`;
    this.request.get(url, this.requestConfig);

    return Promise.resolve({});
  }
}

export default StormGlass;
