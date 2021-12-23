import { Server } from '@overnightjs/core';
import { Application, json } from 'express';

import ForecastController from '@src/controllers/ForecastController';
import * as database from '@src/util/database';

require('dotenv').config();

class SetupServer extends Server {
  public async init(): Promise<void> {
    this.middlewares();
    this.setupControllers();
    // this.start('3000');
    await this.setupDatabase();
  }

  public getApp(): Application {
    return this.app;
  }

  public async close(): Promise<void> {
    await database.close();
    this.app.removeAllListeners();
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

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }
}

export default new SetupServer();
