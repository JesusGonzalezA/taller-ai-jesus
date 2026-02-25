import { describe, expect, it } from 'vitest';
import { generateLineup, parseWhatsAppList, resolveAttendance } from '../src/lineup';
import type { Match, Player } from '../src/types';

const makePlayer = (id: string, position: Player['position']): Player => ({
  id,
  name: `Player ${id}`,
  position,
});

describe('parseWhatsAppList', () => {
  it('parses numbered list', () => {
    const raw = '1. Juan\n2. Pedro\n3. Carlos';
    expect(parseWhatsAppList(raw)).toEqual(['Juan', 'Pedro', 'Carlos']);
  });

  it('parses bullet list', () => {
    const raw = '- Juan\n* Pedro\n• Carlos';
    expect(parseWhatsAppList(raw)).toEqual(['Juan', 'Pedro', 'Carlos']);
  });

  it('filters empty lines', () => {
    const raw = 'Juan\n\nPedro\n\n';
    expect(parseWhatsAppList(raw)).toEqual(['Juan', 'Pedro']);
  });
});

describe('resolveAttendance', () => {
  const players: Player[] = [makePlayer('1', 'goalkeeper'), makePlayer('2', 'defender')];

  it('matches known players case-insensitively', () => {
    const { matched, unmatched } = resolveAttendance(['PLAYER 1', 'player 2', 'Unknown'], players);
    expect(matched).toHaveLength(2);
    expect(unmatched).toEqual(['Unknown']);
  });

  it('returns all as unmatched when no players registered', () => {
    const { matched, unmatched } = resolveAttendance(['Juan'], []);
    expect(matched).toHaveLength(0);
    expect(unmatched).toEqual(['Juan']);
  });
});

describe('generateLineup', () => {
  const noMatches: Match[] = [];

  it('splits 10 players into 2 teams of 5', () => {
    const players = [
      makePlayer('gk1', 'goalkeeper'),
      makePlayer('gk2', 'goalkeeper'),
      makePlayer('def1', 'defender'),
      makePlayer('def2', 'defender'),
      makePlayer('def3', 'defender'),
      makePlayer('def4', 'defender'),
      makePlayer('win1', 'winger'),
      makePlayer('win2', 'winger'),
      makePlayer('fwd1', 'forward'),
      makePlayer('fwd2', 'forward'),
    ];
    const { teamA, teamB, subs } = generateLineup(players, noMatches);
    expect(teamA.length).toBe(5);
    expect(teamB.length).toBe(5);
    expect(subs).toHaveLength(0);
  });

  it('puts the odd player in subs when total is odd', () => {
    const players = [
      makePlayer('gk1', 'goalkeeper'),
      makePlayer('def1', 'defender'),
      makePlayer('def2', 'defender'),
      makePlayer('fwd1', 'forward'),
      makePlayer('fwd2', 'forward'),
      makePlayer('fwd3', 'forward'),
    ];
    const { teamA, teamB, subs } = generateLineup(players, noMatches);
    const total = teamA.length + teamB.length + subs.length;
    expect(total).toBe(players.length);
    expect(Math.abs(teamA.length - teamB.length)).toBeLessThanOrEqual(1);
  });

  it('handles single player gracefully', () => {
    const players = [makePlayer('gk1', 'goalkeeper')];
    const { teamA, teamB, subs } = generateLineup(players, noMatches);
    expect(teamA.length + teamB.length + subs.length).toBe(1);
  });
});
