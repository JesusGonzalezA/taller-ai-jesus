import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { loadPena, savePena } from '../store';
import type { Season } from '../types';

type PenaParams = { id: string };
type SeasonParams = { id: string; seasonId: string };

export const seasonsRouter = Router({ mergeParams: true });

// List seasons
seasonsRouter.get<PenaParams>('/', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  res.json(
    pena.seasons.map(({ id, name, startDate, endDate, closed }) => ({
      id,
      name,
      startDate,
      endDate,
      closed,
      matchCount: pena.seasons.find((s) => s.id === id)?.matches.length ?? 0,
    })),
  );
});

// Create season
seasonsRouter.post<PenaParams>('/', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const { name } = req.body as { name?: string };
  if (!name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  // Close any currently open season first
  for (const s of pena.seasons) {
    if (!s.closed) {
      s.closed = true;
      s.endDate = new Date().toISOString();
    }
  }
  const season: Season = {
    id: uuidv4(),
    name,
    startDate: new Date().toISOString(),
    closed: false,
    matches: [],
  };
  pena.seasons.push(season);
  savePena(pena);
  res.status(201).json(season);
});

// Close season
seasonsRouter.put<SeasonParams>('/:seasonId/close', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const season = pena.seasons.find((s) => s.id === req.params.seasonId);
  if (!season) {
    res.status(404).json({ error: 'Season not found' });
    return;
  }
  if (season.closed) {
    res.status(400).json({ error: 'Season is already closed' });
    return;
  }
  season.closed = true;
  season.endDate = new Date().toISOString();
  savePena(pena);
  res.json(season);
});
