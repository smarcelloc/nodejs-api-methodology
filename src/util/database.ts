import mongoose, { Mongoose } from 'mongoose';

import config from '@src/util/config';

export const connect = async (): Promise<Mongoose> => {
  return await mongoose.connect(config.get('App.database.mongoUrl'));
};

export const close = async (): Promise<void> => {
  return await mongoose.connection.close();
};
