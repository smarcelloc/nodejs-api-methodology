import SetupServer from './server';

(async (): Promise<void> => {
  const server = new SetupServer();
  await server.init();
  server.start();
})();
