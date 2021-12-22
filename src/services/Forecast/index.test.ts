import StormGlass from '@src/clients/StormGlass';

import forecastListBeaches from '@test/fixtures/forecast_list_beaches.json';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

import ForecastService from '.';
import { ForecastProcessingServerError } from './error';
import { Beach, BeachPosition } from './interface';

jest.mock('@src/clients/StormGlass');

describe('Forecast Service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  const beaches: Beach[] = [
    {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.EAST,
      user: 'some-id',
    },
  ];

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );

    const forecast = new ForecastService(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(forecastListBeaches);
  });

  it('should return an empty list when the beaches array is empty', async () => {
    const forecast = new ForecastService();
    const beaches: Beach[] = [];
    const response = await forecast.processForecastForBeaches(beaches);
    expect(response).toEqual([]);
  });

  it('should throw internal processing error when something goes wrong during the rating process', async () => {
    mockedStormGlassService.fetchPoints.mockRejectedValue(
      'Error fetching data'
    );

    const forecast = new ForecastService(mockedStormGlassService);
    await expect(
      forecast.processForecastForBeaches(beaches)
    ).rejects.toThrowError(ForecastProcessingServerError);
  });
});
