import ApiError from '@src/util/errors/ApiError';

describe('ApiError', () => {
  it('should format error with mandatory fields', () => {
    const error = ApiError.format({ code: 404, message: 'User not found!' });
    expect(error).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      code: 404,
    });
  });

  it('should format error with mandatory fields and details', () => {
    const error = ApiError.format({
      code: 404,
      message: 'User not found!',
      details: 'This error happens when there is no user created',
    });

    expect(error).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      code: 404,
      details: 'This error happens when there is no user created',
    });
  });

  it('should format error with mandatory fields and description and documentation', () => {
    const error = ApiError.format({
      code: 404,
      message: 'User not found!',
      details: 'This error happens when there is no user created',
      doc: 'https://mydocs.com/error-404',
    });
    expect(error).toEqual({
      message: 'User not found!',
      error: 'Not Found',
      code: 404,
      details: 'This error happens when there is no user created',
      doc: 'https://mydocs.com/error-404',
    });
  });
});
