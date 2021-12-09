import { Server } from '@overnightjs/core';
import { Application, json } from 'express';
import ForecastController from '@src/controllers/ForecastController';

class SetupServer extends Server {
  public async init(): Promise<void> {
    this.middlewares();
    this.setupControllers();
    this.start('3000');
  }

  public getApp(): Application {
    return this.app;
  }

  private middlewares(): void {
    this.app.use(json());
  }

  private setupControllers(): void {
    this.addControllers([new ForecastController()]);
  }

  private start(port: string): void {
    this.app.listen(port, () => {
      process.stdout.write(`\n[OK] Server listening on port: ${port}\n`);
    });
  }
}

export default new SetupServer();
