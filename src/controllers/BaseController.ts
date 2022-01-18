import { Response } from 'express';
import mongoose from 'mongoose';

import { CUSTOM_VALIDATION } from '@src/models/User';
import logger from '@src/util/logger';

abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, error: unknown): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(error);
      res.status(clientErrors.code).send(clientErrors);
    } else {
      logger.error(error);
      res.status(500).send({ code: 500, error: 'Internal Server Error' });
    }
  }

  private handleClientErrors(error: mongoose.Error.ValidationError) {
    const duplicatedKindErrors = Object.values(error.errors).filter(
      (error) =>
        error.name === 'ValidatorError' &&
        error.kind === CUSTOM_VALIDATION.DUPLICATED
    );

    if (duplicatedKindErrors.length > 0) {
      return { code: 409, error: error.message };
    }

    return { code: 422, error: error.message };
  }
}

export default BaseController;
