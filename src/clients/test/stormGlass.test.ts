import StormGlass from '@src/clients/StormGlass';
import axios from 'axios';
import stormGlassWeatherPointFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormglassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import stormglassIncompletePoint from '@test/fixtures/stormglass_incomplete_weather_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const latitude = -33.792726;
    const longitude = 151.289824;

    axios.get = jest
      .fn()
      .mockResolvedValue({ data: stormGlassWeatherPointFixture });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.featchPoints(latitude, longitude);
    expect(response).toEqual(stormglassNormalizedResponseFixture);
  });

  it('should exclude incomplete data points', async () => {
    const latitude = -33.792726;
    const longitude = 151.289824;

    axios.get = jest
      .fn()
      .mockResolvedValue({ data: stormglassIncompletePoint });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.featchPoints(latitude, longitude);

    expect(response).toEqual([]);
  });
});
