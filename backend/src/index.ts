import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import patientRouter from './routes/patients';
import { initDb } from './db';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/patients', patientRouter);

const basePort = Number(process.env.PORT || 4000);

async function startServer(port: number) {
  return new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      resolve();
    });

    server.on('error', (err: any) => {
      if (err && err.code === 'EADDRINUSE') {
        reject(new Error(`EADDRINUSE:${port}`));
      } else {
        reject(err);
      }
    });
  });
}

initDb().then(async () => {
  try {
    await startServer(basePort);
  } catch (err: any) {
    if (err.message && err.message.startsWith('EADDRINUSE')) {
      const next = basePort + 1;
      console.warn(`Port ${basePort} in use, trying ${next}...`);
      try {
        await startServer(next);
      } catch (err2) {
        console.error(`Failed to bind to ports ${basePort} and ${next}. Please free one of these ports and retry.`);
        process.exit(1);
      }
    } else {
      console.error('Server failed to start', err);
      process.exit(1);
    }
  }
}).catch(err => {
  console.error('Failed to initialize DB', err);
  process.exit(1);
});
