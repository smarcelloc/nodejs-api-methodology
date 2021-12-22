import InternalError from '@src/util/errors/InternalError';

export class ForecastProcessingServerError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}
