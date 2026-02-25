import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { loadPena, savePena } from '../store';
import type { Player, Position } from '../types';

type PenaParams = { id: string };
type PlayerParams = { id: string; playerId: string };

export const playersRouter = Router({ mergeParams: true });

// List players
playersRouter.get<PenaParams>('/', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  res.json(pena.players);
});

// Add player
playersRouter.post<PenaParams>('/', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const { name, position } = req.body as { name?: string; position?: Position };
  if (!name || !position) {
    res.status(400).json({ error: 'name and position are required' });
    return;
  }
  const player: Player = { id: uuidv4(), name, position };
  pena.players.push(player);
  savePena(pena);
  res.status(201).json(player);
});

// Update player
playersRouter.put<PlayerParams>('/:playerId', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const idx = pena.players.findIndex((p) => p.id === req.params.playerId);
  if (idx === -1) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  const updates = req.body as Partial<Player>;
  pena.players[idx] = { ...pena.players[idx], ...updates };
  savePena(pena);
  res.json(pena.players[idx]);
});

// Delete player
playersRouter.delete<PlayerParams>('/:playerId', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const idx = pena.players.findIndex((p) => p.id === req.params.playerId);
  if (idx === -1) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  pena.players.splice(idx, 1);
  savePena(pena);
  res.status(204).end();
});
