import { Server } from '@overnightjs/core';
import { Application, json } from 'express';

import BeachController from '@src/controllers/BeachController';
import ForecastController from '@src/controllers/ForecastController';
import UserController from '@src/controllers/UserController';
import * as database from '@src/util/database';

import env from './config/env';

class SetupServer extends Server {
  public constructor(private port: number = env.app.port) {
    super();
  }

  public async init(): Promise<void> {
    this.middlewares();
    this.setupControllers();
    await this.setupDatabase();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.info(`\n[OK] Server listening on port: ${this.port}\n`);
    });
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }

  private middlewares(): void {
    this.app.use(json());
  }

  private setupControllers(): void {
    this.addControllers([
      new ForecastController(),
      new BeachController(),
      new UserController(),
    ]);
  }

  private async setupDatabase(): Promise<void> {
    await database.connect();
  }
}

export default SetupServer;
