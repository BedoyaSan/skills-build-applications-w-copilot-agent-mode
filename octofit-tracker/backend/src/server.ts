import express, { NextFunction, Request, Response } from 'express';
import { connectDatabase } from './config/database.js';
import { apiRouter } from './routes/api.js';

const app = express();
const port = Number(process.env.PORT || 8000);

app.use((_, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type');
  response.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  next();
});
app.use(express.json());
app.get('/health', (_, response) => response.json({ status: 'ok', service: 'octofit-api' }));
app.use('/api', apiRouter);
app.use((error: Error, _: Request, response: Response, next: NextFunction) => {
  if (response.headersSent) return next(error);
  response.status(500).json({ error: error.message || 'Internal server error' });
});

connectDatabase()
  .then(() => app.listen(port, () => console.log(`OctoFit API listening on port ${port}`)))
  .catch((error: unknown) => {
    console.error('Unable to start API:', error);
    process.exit(1);
  });
