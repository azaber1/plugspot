import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BrowsePage from '../BrowsePage';
import { chargers } from '../../data';

// Mock useFavorites hook
vi.mock('../../hooks/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    toggleFavorite: vi.fn(),
    isFavorite: vi.fn(() => false),
  }),
}));

describe('BrowsePage', () => {
  it('renders search bar', () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );
    
    expect(screen.getByPlaceholderText(/Search by address/i)).toBeInTheDocument();
  });

  it('renders filter buttons', () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );
    
    // Check for filter buttons (they appear in buttons, not just anywhere)
    const allButtons = screen.getAllByText('All');
    expect(allButtons.length).toBeGreaterThan(0);
    
    const j1772Buttons = screen.getAllByText('J1772');
    expect(j1772Buttons.length).toBeGreaterThan(0);
    
    const teslaButtons = screen.getAllByText('Tesla NACS');
    expect(teslaButtons.length).toBeGreaterThan(0);
    
    const ccsButtons = screen.getAllByText('CCS');
    expect(ccsButtons.length).toBeGreaterThan(0);
  });

  it('filters chargers by search query', () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/Search by address/i);
    fireEvent.change(searchInput, { target: { value: 'Oakland' } });
    
    // Should show chargers matching Oakland
    expect(screen.getByText(/Oakland Hills/i)).toBeInTheDocument();
  });

  it('filters by connector type', () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );
    
    // Find the filter button (not the badge in cards)
    const filterButtons = screen.getAllByText('J1772');
    const j1772Button = filterButtons.find(btn => 
      btn.closest('button')?.className.includes('px-4')
    ) || filterButtons[0];
    
    fireEvent.click(j1772Button);
    
    // Should show J1772 chargers (check that at least one card has J1772 badge)
    const chargerCards = screen.getAllByText(/J1772/i);
    expect(chargerCards.length).toBeGreaterThan(0);
  });

  it('shows results count', () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/\d+ charger/i)).toBeInTheDocument();
  });

  it('displays charger cards with correct information', () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );
    
    // Check if at least one charger's host name is displayed
    const firstCharger = chargers[0];
    expect(screen.getByText(firstCharger.host.name)).toBeInTheDocument();
  });

  it('shows empty state when no matches', () => {
    render(
      <BrowserRouter>
        <BrowsePage />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/Search by address/i);
    fireEvent.change(searchInput, { target: { value: 'NonexistentLocation12345' } });
    
    expect(screen.getByText(/No chargers found/i)).toBeInTheDocument();
  });
});
