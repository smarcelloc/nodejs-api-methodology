import nock from 'nock';

import { Beach, BeachPosition, BeachProps } from '@src/model/Beach';

import forecastListBeaches from '@test/fixtures/forecast_list_beaches.json';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';

describe('Beach forecast functional tests', () => {
  beforeEach(async () => {
    await Beach.deleteMany({});

    const defaultBeach: BeachProps = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.EAST,
    };

    const beach = new Beach(defaultBeach);
    await beach.save();
  });

  it('should return a forecast with just a few times', async () => {
    nockSimulateStormGlass();

    const { body, status } = await global.testRequest.get('/forecast');
    expect(status).toBe(200);
    expect(body).toEqual(forecastListBeaches);
  });
});

const nockSimulateStormGlass = () => {
  nock('https://api.stormglass.io:443', {
    encodedQueryParams: true,
    reqheaders: {
      Authorization: (): boolean => true,
    },
  })
    .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
    .get('/v2/weather/point')
    .query({
      lat: '-33.792726',
      lng: '151.289824',
      params: /(.*)/,
      source: 'noaa',
    })
    .reply(200, stormGlassWeather3HoursFixture);
};
