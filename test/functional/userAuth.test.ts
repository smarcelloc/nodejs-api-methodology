import UserModel from '@src/models/User';
import AuthService from '@src/services/AuthService';

describe('When authenticating a user', () => {
  beforeEach(async () => await UserModel.deleteMany());

  it('should generate a token for a valid user', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
    };

    await new UserModel(user).save();

    const response = await global.testRequest.post('/users/authenticate').send({
      email: user.email,
      password: user.password,
    });

    expect(response.body).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });

  it('Should return UNAUTHORIZED if the user with the given email is not found', async () => {
    const response = await global.testRequest
      .post('/users/authenticate')
      .send({ email: 'some-email@mail.com', password: '1234' });

    expect(response.status).toBe(401);
  });

  it('Should return ANAUTHORIZED if the user is found but the password does not match', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
    };
    await new UserModel(newUser).save();
    const response = await global.testRequest
      .post('/users/authenticate')
      .send({ email: newUser.email, password: 'different password' });

    expect(response.status).toBe(401);
  });

  it("Should return the token's owner profile information", async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
    };

    const user = await new UserModel(newUser).save();
    const token = AuthService.generateToken(user.toJSON());
    const { body, status } = await global.testRequest
      .get('/users/me')
      .set({ 'x-access-token': token });

    expect(status).toBe(200);
    expect(body).toMatchObject(JSON.parse(JSON.stringify({ user })));
  });

  it('Should return Not Found, when the user is not found', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
    };

    // create a new user but don't save it
    const user = new UserModel(newUser);
    const token = AuthService.generateToken(user.toJSON());
    const { body, status } = await global.testRequest
      .get('/users/me')
      .set({ 'x-access-token': token });

    expect(status).toBe(404);
    expect(body.message).toBe('User not found!');
  });
});
