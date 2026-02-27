import cors from 'cors';
import express from 'express';
import campaignRouter from './routes/campaign';
import healthRouter from './routes/health';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use('/api/health', healthRouter);
app.use('/api/campaigns', campaignRouter);

export default app;
