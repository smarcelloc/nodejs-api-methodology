import ServerError from '@src/util/errors/ServerError';

export class ForecastProcessingServerError extends ServerError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}
