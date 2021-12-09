import SetupServer from '@src/server';
import supertest from 'supertest';

beforeAll(async () => {
  await SetupServer.init();
  global.testRequest = supertest(SetupServer.getApp());
});

afterAll(async () => await SetupServer.close());
