import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  it('renders the sidebar brand name', () => {
    render(<App />);
    expect(screen.getByText('MarketingAI', { exact: false })).toBeInTheDocument();
  });

  it('renders the dashboard heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Dashboard');
  });

  it('renders navigation links', () => {
    render(<App />);
    const nav = document.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav?.textContent).toContain('Empresa');
    expect(nav?.textContent).toContain('Campañas');
    expect(nav?.textContent).toContain('Nueva campaña');
  });
});
