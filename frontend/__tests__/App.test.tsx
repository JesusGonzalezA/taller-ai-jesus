import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

// Mock the API so no actual network calls happen
vi.mock('../src/api/client', () => ({
  api: {
    listPenas: () => Promise.resolve([]),
    createPena: (data: { name: string }) =>
      Promise.resolve({ id: 'test-id', settings: { name: data.name } }),
    getPena: () =>
      Promise.resolve({
        id: 'test-id',
        settings: {
          name: 'Test',
          matchesPerWeek: 1,
          teamA: { name: 'A', color: '#000' },
          teamB: { name: 'B', color: '#fff' },
        },
        players: [],
        seasons: [],
      }),
    getSeasons: () => Promise.resolve([]),
    getMatches: () => Promise.resolve([]),
    getStats: () => Promise.reject(new Error('No season')),
    getPlayers: () => Promise.resolve([]),
  },
}));

describe('App routing', () => {
  it('renders the home page at /', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Peñas de');
  });
});

describe('HomePage', () => {
  it('renders create form', () => {
    render(<App />);
    expect(screen.getByLabelText(/nombre de la peña/i)).toBeInTheDocument();
  });

  it('renders the existing peñas section', () => {
    render(<App />);
    expect(screen.getByText(/peñas existentes/i)).toBeInTheDocument();
  });
});
