import { UserType, User } from '@src/models/User';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should successfully save a new user', async () => {
    const user: UserType = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: 'Password@123',
    };

    const response = await global.testRequest.post('/users').send(user);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(user));
  });
});
