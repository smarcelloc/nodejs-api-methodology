import BeachModel from '@src/models/Beach';
import UserModel from '@src/models/User';
import AuthService from '@src/services/AuthService';

describe('Beaches functional tests', () => {
  const defaultUser = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '1234',
  };

  let token = '';

  beforeEach(async () => {
    await BeachModel.deleteMany();
    await UserModel.deleteMany();

    const user = await new UserModel(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });

  it('should create a beach with success', async () => {
    const newBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: 'E',
    };

    const response = await global.testRequest
      .post('/beaches')
      .set({ 'x-access-token': token })
      .send(newBeach);
    expect(response.status).toBe(201);

    expect(response.body).toEqual(expect.objectContaining(newBeach));
  });

  it('should return 422 when there is a validation error', async () => {
    const newBeach = {
      lat: 'invalid_string',
      lng: 151.289824,
      name: 'Manly',
      position: 'E',
    };

    const response = await global.testRequest
      .post('/beaches')
      .set({ 'x-access-token': token })
      .send(newBeach);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      code: 422,
      error: 'Unprocessable Entity',
      message:
        'Beach validation failed: lat: Cast to Number failed for value "invalid_string" (type string) at path "lat"',
    });
  });

  it('should return 500 when there is any error other than validation error', async () => {
    jest.spyOn(BeachModel.prototype, 'save').mockRejectedValueOnce('fail to create beach');
    const newBeach = {
      lat: -33.792726,
      lng: 46.43243,
      name: 'Manly',
      position: 'E',
    };

    const response = await global.testRequest
      .post('/beaches')
      .send(newBeach)
      .set({ 'x-access-token': token });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      code: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong!',
    });
  });
});
