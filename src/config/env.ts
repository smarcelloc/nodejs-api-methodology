require('dotenv').config();

const {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  APP_PORT,
  APP_ENV,
  APP_KEY,
  STORMGLASS_URI,
  STORMGLASS_KEY,
  STORMGLASS_SOURCE,
  STORMGLASS_PARAMS,
  MONGODB_URI,
} = process.env;

const env = {
  app: {
    name: APP_NAME || 'API Nameless',
    version: APP_VERSION || '0.0.0',
    description: APP_DESCRIPTION || '',
    port: APP_PORT || '3000',
    env: APP_ENV || 'local',
    key: APP_KEY || '',
  },
  stormGlass: {
    uri: STORMGLASS_URI || '',
    key: STORMGLASS_KEY || '',
    params: STORMGLASS_PARAMS || '',
    source: STORMGLASS_SOURCE || 'noaa',
  },
  mongoDB: {
    uri: MONGODB_URI || '',
  },
};

export default env;
