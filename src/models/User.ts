import mongoose from 'mongoose';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

const schema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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

const UserModel = mongoose.model('User', schema);
export default UserModel;
