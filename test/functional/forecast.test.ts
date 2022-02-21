import nock from 'nock';

import BeachModel, { BeachPosition } from '@src/models/Beach';
import UserModel from '@src/models/User';
import AuthService from '@src/services/AuthService';

import forecastListBeaches from '@test/fixtures/forecast_list_beaches.json';
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';

describe('Beach forecast functional tests', () => {
  let token = '';

  beforeEach(async () => {
    await BeachModel.deleteMany();
    await UserModel.deleteMany();

    const defaultUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
    };

    const user = await new UserModel(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.EAST,
      userId: user.id,
    };

    await new BeachModel(defaultBeach).save();
  });

  it('should return a forecast with just a few times', async () => {
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
        end: /(.*)/,
      })
      .reply(200, stormGlassWeather3HoursFixture);

    const { body, status } = await global.testRequest
      .get('/forecast')
      .set({ 'x-access-token': token });

    expect(status).toBe(200);
    expect(body).toEqual(forecastListBeaches);
  });

  it('should return 500 if something goes wrong during the processing', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v1/weather/point')
      .query({ lat: '-33.792726', lng: '151.289824' })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest.get(`/forecast`).set({ 'x-access-token': token });

    expect(status).toBe(500);
  });
});
