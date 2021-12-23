import { Beach } from '@src/model/Beach';

describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany());

  it('should create a beach with success', async () => {
    const newBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: 'E',
    };

    const response = await global.testRequest.post('/beaches').send(newBeach);
    expect(response.status).toBe(201);

    expect(response.body).toEqual(expect.objectContaining(newBeach));
  });
});
