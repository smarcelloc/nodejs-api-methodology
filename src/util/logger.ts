import pino from 'pino';

import env from '@src/config/env';

export default pino({
  enabled: env.logger.enable,
  level: env.logger.level,
});
