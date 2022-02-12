import mongoose, { Document, Model, Schema, SchemaDefinitionProperty } from 'mongoose';

export enum BeachPosition {
  SOUTH = 'S',
  EAST = 'E',
  WEST = 'W',
  NOUTH = 'N',
}

export interface Beach {
  _id?: string;
  lat: number;
  lng: number;
  name: string;
  position: string;
  userId: string | SchemaDefinitionProperty<string>;
}

interface BeachDocument extends Omit<Beach, '_id'>, Document {}

const schema = new mongoose.Schema<BeachDocument>(
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: {
      transform: (_, ret: BeachDocument): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const BeachModel: Model<BeachDocument> = mongoose.model('Beach', schema);
export default BeachModel;
