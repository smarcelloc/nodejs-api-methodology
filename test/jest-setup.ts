import supertest from 'supertest';

import SetupServer from '@src/server';

beforeAll(async () => {
  await SetupServer.init();
  global.testRequest = supertest(SetupServer.getApp());
});

// Close Connection mongoDB
// afterAll(async () => await SetupServer.close());
