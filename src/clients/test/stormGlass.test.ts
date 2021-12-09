import StormGlass from '@src/clients/StormGlass';
import axios from 'axios';

jest.mock('axios');

describe('StormGlass client', () => {
  it('should return the normalized forecast from the StormGlass service', async () => {
    const latitude = -33.792726;
    const longitude = 151.289824;

    axios.get = jest.fn().mockResolvedValue({});

    const stormGlass = new StormGlass(axios);
    const response = await stormGlass.featchPoints(latitude, longitude);
    expect(response).toEqual({});
  });
});
