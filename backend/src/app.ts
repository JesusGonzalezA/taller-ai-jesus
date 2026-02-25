import express from 'express';
import { matchesRouter } from './routes/matches';
import { penasRouter } from './routes/penas';
import { playersRouter } from './routes/players';
import { seasonsRouter } from './routes/seasons';
import { statsRouter } from './routes/stats';

export const app = express();

app.use(express.json());

// Allow frontend dev server (Vite on :5173) to call backend (on :3000)
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/penas', penasRouter);
app.use('/api/penas/:id/players', playersRouter);
app.use('/api/penas/:id/seasons', seasonsRouter);
app.use('/api/penas/:id/matches', matchesRouter);
app.use('/api/penas/:id/stats', statsRouter);

export default app;
