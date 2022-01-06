import StormGlass from '@src/clients/StormGlass';
import { BeachPosition, Beach } from '@src/models/Beach';
import ForecastService from '@src/services/ForecastService';

import forecastListBeaches from '@test/fixtures/forecast_list_beaches.json';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/clients/StormGlass');

describe('Forecast Service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  const beaches: Beach[] = [
    {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.EAST,
    },
  ];

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(
      stormGlassNormalizedResponseFixture
    );

    const forecastService = new ForecastService(mockedStormGlassService);
    const beachesWithRating = await forecastService.processForecastForBeaches(
      beaches
    );

    expect(beachesWithRating).toEqual(forecastListBeaches);
  });

  it('should return an empty list when the beaches array is empty', async () => {
    const forecastService = new ForecastService();
    const beaches: Beach[] = [];
    const response = await forecastService.processForecastForBeaches(beaches);

    expect(response).toEqual([]);
  });

  it('should throw internal processing error when something goes wrong during the rating process', async () => {
    mockedStormGlassService.fetchPoints.mockRejectedValue({
      message: 'Error fetching data',
    });

    const forecastService = new ForecastService(mockedStormGlassService);

    await expect(
      forecastService.processForecastForBeaches(beaches)
    ).rejects.toThrow(
      'Unexpected error during the forecast processing: Error fetching data'
    );
  });
});
