/* eslint-disable no-unused-vars */
import mongoose, { Document, Model } from 'mongoose';

export enum BeachPosition {
  SOUTH = 'S',
  EAST = 'E',
  WEST = 'W',
  NOUTH = 'N',
}

export interface BeachType {
  _id?: string;
  lat: number;
  lng: number;
  name: string;
  position: string;
}

const schema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface BeachModel extends Omit<BeachType, '_id'>, Document {}
export const Beach: Model<BeachModel> = mongoose.model('Beach', schema);
