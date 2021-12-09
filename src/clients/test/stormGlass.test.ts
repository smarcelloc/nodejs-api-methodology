import StormGlass from '@src/clients/StormGlass';
import axios from 'axios';
import stormGlassWeatherPointFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormglassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import stormglassIncompletePoint from '@test/fixtures/stormglass_incomplete_weather_3_hours.json';

jest.mock('axios');

describe('StormGlass client', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;

  const latituteFake = -33.792726;
  const longitudeFake = 151.289824;

  it('should return the normalized forecast from the StormGlass service', async () => {
    mockAxios.get.mockResolvedValue({ data: stormGlassWeatherPointFixture });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(latituteFake, longitudeFake);
    expect(response).toEqual(stormglassNormalizedResponseFixture);
  });

  it('should exclude incomplete data points', async () => {
    mockAxios.get.mockResolvedValue({ data: stormglassIncompletePoint });

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.fetchPoints(latituteFake, longitudeFake);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    mockAxios.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockAxios);

    await expect(
      stormGlass.fetchPoints(latituteFake, longitudeFake)
    ).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    mockAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    const stormGlass = new StormGlass(mockAxios);

    await expect(
      stormGlass.fetchPoints(latituteFake, longitudeFake)
    ).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
