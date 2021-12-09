import { AxiosStatic } from 'axios';

class StormGlass {
  constructor(protected request: AxiosStatic) {}

  public featchPoints(latitude: number, longitude: number): Promise<{}> {
    this.request.get(
      `https://api.stormglass.io/v2/weather/point?lat=${latitude}&lng=${longitude}&params=swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed&source=noaa`
    );
    return Promise.resolve({});
  }
}

export default StormGlass;
