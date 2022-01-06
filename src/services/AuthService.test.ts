import AuthService from '@src/services/AuthService';

describe('Auth Service', () => {
  it('should successfully in encrypted password', async () => {
    const password = 'Password@123';
    const hash = await AuthService.hashPassword(password);
    const comparePassword = await AuthService.comparePassword(password, hash);

    expect(true).toEqual(comparePassword);
  });

  it('should successfully in comparing the password with the generated hash', async () => {
    const hash = '$2b$10$bn1InhBbKyCTGbeh1/.UMuwVjv8/Am/oyATqDl0zEmmz.8UHBZq2q';
    const password = 'Password@123';

    const comparePassword = await AuthService.comparePassword(password, hash);

    expect(true).toEqual(comparePassword);
  });

  it('should wrong in comparing the password with the generated hash', async () => {
    const hash = 'hash_fail';
    const password = 'Password@123';

    const comparePassword = await AuthService.comparePassword(password, hash);

    expect(false).toEqual(comparePassword);
  });
});
