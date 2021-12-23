import mongoose, { Mongoose } from 'mongoose';

import env from '@src/config/env';

export const connect = async (): Promise<Mongoose> => {
  return await mongoose.connect(env.mongoDB.uri);
};

export const close = async (): Promise<void> => {
  return await mongoose.connection.close();
};
