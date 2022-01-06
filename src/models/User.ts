/* eslint-disable no-unused-vars */
import mongoose, { Document, Model } from 'mongoose';

import AuthService from '@src/services/AuthService';

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
}

interface UserDocument extends Omit<User, '_id'>, Document {}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

const schema = new mongoose.Schema<UserDocument>(
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
      transform: (_, ret: UserDocument): void => {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

schema.path('email').validate(
  async (email: string): Promise<boolean> => {
    const emailCount = await mongoose.models.User.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<UserDocument>('save', async function () {
  try {
    if (this.password && this.isModified('password')) {
      this.password = await AuthService.hashPassword(this.password);
    }
  } catch (error: any) {
    console.error(
      `Error hashing the password for the user ${this.name}`,
      error
    );
  }
});

const UserModel: Model<UserDocument> = mongoose.model('User', schema);
export default UserModel;
