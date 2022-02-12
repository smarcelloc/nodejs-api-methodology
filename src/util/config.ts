import configuration from 'config';

export interface IConfig {
  get<T>(key: string): T;
  has(key: string): boolean;
}

class Config implements IConfig {
  public get<T = string>(key: string): T {
    return configuration.get(key);
  }

  public has(key: string): boolean {
    return configuration.has(key);
  }
}

const config: IConfig = new Config();
export default config;
