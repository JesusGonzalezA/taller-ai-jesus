import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { listPenas, loadPena, savePena } from '../store';
import type { Pena, PenaSettings } from '../types';

export const penasRouter = Router();

// List all peñas
penasRouter.get('/', (_req, res) => {
  const penas = listPenas().map(({ id, settings }) => ({ id, settings }));
  res.json(penas);
});

// Create a peña
penasRouter.post('/', (req, res) => {
  const { name, matchesPerWeek, teamA, teamB } = req.body as Partial<PenaSettings>;
  if (!name) {
    res.status(400).json({ error: 'name is required' });
    return;
  }
  const pena: Pena = {
    id: uuidv4(),
    settings: {
      name,
      matchesPerWeek: matchesPerWeek ?? 1,
      teamA: teamA ?? { name: 'Equipo A', color: '#3b82f6' },
      teamB: teamB ?? { name: 'Equipo B', color: '#ef4444' },
    },
    players: [],
    seasons: [],
  };
  savePena(pena);
  res.status(201).json(pena);
});

// Get a peña
penasRouter.get('/:id', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  res.json(pena);
});

// Update peña settings
penasRouter.put('/:id/settings', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const updates = req.body as Partial<PenaSettings>;
  pena.settings = { ...pena.settings, ...updates };
  savePena(pena);
  res.json(pena);
});

// Delete a peña
penasRouter.delete('/:id', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  import('../store').then(({ deletePena }) => {
    deletePena(req.params.id);
    res.status(204).end();
  });
});
