import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Taller AI');
  });

  it('renders the API link', () => {
    render(<App />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/api/health');
  });
});
