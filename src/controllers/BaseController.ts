import { Response } from 'express';
import mongoose from 'mongoose';

import { CUSTOM_VALIDATION } from '@src/models/User';
import ApiError, { IApiError } from '@src/util/errors/ApiError';
import logger from '@src/util/logger';

abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, error: unknown): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);

      res
        .status(clientErrors.code)
        .send(ApiError.format({ code: clientErrors.code, message: clientErrors.error }));
    } else {
      logger.error(error);
      res.status(500).send(ApiError.format({ code: 500, message: 'Internal Server Error' }));
    }
  }

  private handleClientErrors(error: mongoose.Error.ValidationError) {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (error) => error.name === 'ValidatorError' && error.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (duplicatedKindErrors.length > 0) {
      return { code: 409, error: error.message };
    }

    return { code: 422, error: error.message };
  }

  protected sendErrorResponse(res: Response, apiError: IApiError) {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}

export default BaseController;
