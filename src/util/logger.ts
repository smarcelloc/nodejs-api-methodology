import pino from 'pino';

import config from '@src/util/config';

const logger = pino({
  enabled: config.get('App.logger.enabled'),
  level: config.get('App.logger.level'),
});

export default logger;
