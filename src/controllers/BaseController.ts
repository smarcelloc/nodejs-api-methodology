import { Response } from 'express';
import mongoose from 'mongoose';

abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, error: unknown): void {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(422).send({ error: error.message });
    } else {
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

export default BaseController;
