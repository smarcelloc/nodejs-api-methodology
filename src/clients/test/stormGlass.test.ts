import StormGlass from '@src/clients/StormGlass';
import stormGlassWeatherPointFixture from '@test/fixtures/stormglass_weather_3_hours.json';
import stormglassNormalizedResponseFixture from '@test/fixtures/stormglass_normalized_response_3_hours.json';
import stormglassIncompletePoint from '@test/fixtures/stormglass_incomplete_weather_3_hours.json';
import * as HTTPUtil from '@src/util/request';

jest.mock('@src/util/request');

describe('StormGlass client', () => {
  const mockRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;

  const latituteFake = -33.792726;
  const longitudeFake = 151.289824;

  it('should return the normalized forecast from the StormGlass service', async () => {
    mockRequest.get.mockResolvedValue({
      data: stormGlassWeatherPointFixture,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockRequest);
    const response = await stormGlass.fetchPoints(latituteFake, longitudeFake);
    expect(response).toEqual(stormglassNormalizedResponseFixture);
  });

  it('should exclude incomplete data points', async () => {
    mockRequest.get.mockResolvedValue({
      data: stormglassIncompletePoint,
    } as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockRequest);
    const response = await stormGlass.fetchPoints(latituteFake, longitudeFake);

    expect(response).toEqual([]);
  });

  it('should get a generic error from StormGlass service when the request fail before reaching the service', async () => {
    mockRequest.get.mockRejectedValue({ message: 'Network Error' });

    const stormGlass = new StormGlass(mockRequest);

    await expect(
      stormGlass.fetchPoints(latituteFake, longitudeFake)
    ).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    mockRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] },
      },
    });

    MockedRequestClass.isRequestError.mockReturnValue(true);

    const stormGlass = new StormGlass(mockRequest);

    await expect(
      stormGlass.fetchPoints(latituteFake, longitudeFake)
    ).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
