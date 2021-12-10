/* eslint-disable no-unused-vars */

import { ForecastPoint } from '@src/clients/StormGlass/interfaces';

export enum BeachPosition {
  SOUTH = 'S',
  EAST = 'E',
  WEST = 'W',
  NOUTH = 'N',
}

export interface Beach {
  lat: number;
  lng: number;
  name: string;
  position: BeachPosition;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[];
}
