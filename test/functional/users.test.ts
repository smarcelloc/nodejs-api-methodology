import UserModel, { User } from '@src/models/User';

describe('Users functional tests', () => {
  beforeEach(async () => await UserModel.deleteMany());

  it('should successfully save a new user', async () => {
    const user: User = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: 'Password@123',
    };

    const response = await global.testRequest.post('/users').send(user);
    expect(response.status).toBe(201);

    delete user.password;

    expect(response.body).toEqual(expect.objectContaining(user));
  });

  it('Should return 422 when there is a validation error', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@mail.com',
    };

    const response = await global.testRequest.post('/users').send(user);
    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      code: 422,
      error: 'User validation failed: password: Path `password` is required.',
    });
  });

  it('Should return 409 when the email already exists', async () => {
    const user = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234',
    };

    // First: save new USER 01
    await global.testRequest.post('/users').send(user);

    // Seconds: save new USER 02
    const response = await global.testRequest.post('/users').send(user);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      code: 409,
      error: 'User validation failed: email: already exists in the database.',
    });
  });
});

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

    expect(response.body).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    );
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
});
