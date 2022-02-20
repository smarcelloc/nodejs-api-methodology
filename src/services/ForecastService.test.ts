import StormGlass from '@src/clients/StormGlass';
import { Beach, BeachPosition } from '@src/models/Beach';
import ForecastService from '@src/services/ForecastService';

import forecastListBeaches from '@test/fixtures/forecast_list_beaches.json';
import stormGlassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';

jest.mock('@src/clients/StormGlass');

describe('Forecast Service', () => {
  const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;

  const beaches = [
    {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.EAST,
      userId: 'user-fake',
    },
  ];

  it('should return the forecast for mutiple beaches in the same hour with different ratings', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100,
      },
    ]);

    mockedStormGlassService.fetchPoints.mockResolvedValueOnce([
      {
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 13.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 2.07,
        windDirection: 299.45,
        windSpeed: 100,
      },
    ]);

    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.EAST,
        userId: 'fake-id',
      },
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Dee Why',
        position: BeachPosition.SOUTH,
        userId: 'fake-id',
      },
    ];

    const expectedResponse = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: BeachPosition.EAST,
            rating: 2,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100,
          },
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Dee Why',
            position: BeachPosition.SOUTH,
            rating: 3,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 13.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 2.07,
            windDirection: 299.45,
            windSpeed: 100,
          },
        ],
      },
    ];
    const forecast = new ForecastService(mockedStormGlassService);
    const beachesWithRating = await forecast.processForecastForBeaches(beaches);
    expect(beachesWithRating).toEqual(expectedResponse);
  });

  it('should return the forecast for a list of beaches', async () => {
    mockedStormGlassService.fetchPoints.mockResolvedValue(stormGlassNormalizedResponseFixture);

    const forecastService = new ForecastService(mockedStormGlassService);
    const beachesWithRating = await forecastService.processForecastForBeaches(beaches);

    expect(beachesWithRating).toEqual(forecastListBeaches);
  });

  it('should return an empty list when the beaches array is empty', async () => {
    const forecastService = new ForecastService();
    const beaches: any[] = [];
    const response = await forecastService.processForecastForBeaches(beaches);

    expect(response).toEqual([]);
  });

  it('should throw internal processing error when something goes wrong during the rating process', async () => {
    mockedStormGlassService.fetchPoints.mockRejectedValue({
      message: 'Error fetching data',
    });

    const forecastService = new ForecastService(mockedStormGlassService);

    await expect(forecastService.processForecastForBeaches(beaches)).rejects.toThrow(
      'Unexpected error during the forecast processing: Error fetching data'
    );
  });
});
