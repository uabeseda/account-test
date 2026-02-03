import express, { Application } from 'express';
import accountRoutes from './routes/account.routes';
import { errorHandler } from './middleware/error.middleware';

export const createApp = (): Application => {
  const app = express();

  app.use(express.json());

  app.use('/accounts', accountRoutes);

  app.use(errorHandler);

  return app;
};
