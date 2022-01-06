import authMiddleware from '@src/middlewares/authMiddleware';
import AuthService from '@src/services/AuthService';

describe('AuthMiddleware', () => {
  it('should verify a JWT token and call the next middleware', () => {
    const jwtToken = AuthService.generateToken({ data: 'fake' });

    const reqFake = {
      headers: {
        'x-access-token': jwtToken,
      },
    };

    const nextFake = jest.fn();
    const resFake = {};

    authMiddleware(reqFake, resFake, nextFake);
    expect(nextFake).toHaveBeenCalled();
  });
});
