require('dotenv').config();

const { APP_NAME, APP_VERSION, APP_DESCRIPTION, APP_PORT, APP_ENV, APP_KEY } =
  process.env;

const env = {
  app: {
    name: APP_NAME || 'API Nameless',
    version: APP_VERSION || '0.0.0',
    description: APP_DESCRIPTION || '',
    port: APP_PORT || '3000',
    env: APP_ENV || 'local',
    key: APP_KEY || '',
  },
};

export default env;
