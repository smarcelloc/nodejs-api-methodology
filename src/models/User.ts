import mongoose, { Document, Model } from 'mongoose';

export interface UserType {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
    },
  }
);

interface UserModel extends Omit<UserType, '_id'>, Document {}
export const User: Model<UserModel> = mongoose.model('User', schema);
