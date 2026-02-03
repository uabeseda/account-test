import { createApp } from './app';
import { connectToDatabase, closeConnection } from './db/connection';

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  await connectToDatabase();

  const app = createApp();

  const server = app.listen(PORT, () => {});

  const shutdown = async () => {
    server.close(async () => {
      await closeConnection();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((error) => {
  process.exit(1);
});
