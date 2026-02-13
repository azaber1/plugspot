import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import ChargerDetailPage from '../ChargerDetailPage';
import { chargers } from '../../data';

// Mock useToast
const mockShowToast = vi.fn();
vi.mock('../../components/ToastContext', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

// Mock useFavorites
vi.mock('../../hooks/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    toggleFavorite: vi.fn(),
    isFavorite: vi.fn(() => false),
  }),
}));

describe('ChargerDetailPage', () => {
  it('renders charger details for valid ID', () => {
    const charger = chargers[0];
    
    render(
      <MemoryRouter initialEntries={[`/charger/${charger.id}`]}>
        <Routes>
          <Route path="/charger/:id" element={<ChargerDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText(charger.host.name)).toBeInTheDocument();
  });

  it('calculates booking cost correctly', () => {
    const charger = chargers[0];
    const duration = 2;
    const expectedEnergyCost = charger.pricePerKwh * charger.powerKW * duration;
    const expectedTotal = expectedEnergyCost + charger.accessFee;
    
    render(
      <MemoryRouter initialEntries={[`/charger/${charger.id}`]}>
        <Routes>
          <Route path="/charger/:id" element={<ChargerDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Check if total cost is displayed
    const totalElement = screen.getByText(new RegExp(`\\$${expectedTotal.toFixed(2)}`));
    expect(totalElement).toBeInTheDocument();
  });

  it('allows duration selection', () => {
    const charger = chargers[0];
    
    render(
      <MemoryRouter initialEntries={[`/charger/${charger.id}`]}>
        <Routes>
          <Route path="/charger/:id" element={<ChargerDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    const fourHourButton = screen.getByText('4h');
    fireEvent.click(fourHourButton);
    
    // Duration should be updated (cost should change)
    expect(fourHourButton).toHaveClass('bg-electric-green');
  });

  it('shows booking confirmation toast on book now', () => {
    const charger = chargers[0];
    
    render(
      <MemoryRouter initialEntries={[`/charger/${charger.id}`]}>
        <Routes>
          <Route path="/charger/:id" element={<ChargerDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    const bookButton = screen.getByText('Book Now');
    fireEvent.click(bookButton);
    
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('Booking confirmed'),
      'success'
    );
  });

  it('displays charger specifications', () => {
    const charger = chargers[0];
    
    render(
      <MemoryRouter initialEntries={[`/charger/${charger.id}`]}>
        <Routes>
          <Route path="/charger/:id" element={<ChargerDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText(charger.connector)).toBeInTheDocument();
    // Check for power level in the specs section (more specific)
    const powerElements = screen.getAllByText(new RegExp(`${charger.powerKW} kW`));
    expect(powerElements.length).toBeGreaterThan(0);
  });

  it('displays reviews', () => {
    const charger = chargers[0];
    
    render(
      <MemoryRouter initialEntries={[`/charger/${charger.id}`]}>
        <Routes>
          <Route path="/charger/:id" element={<ChargerDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    
    if (charger.reviews.length > 0) {
      expect(screen.getByText(new RegExp(`Reviews \\(${charger.reviews.length}\\)`))).toBeInTheDocument();
    }
  });
});
