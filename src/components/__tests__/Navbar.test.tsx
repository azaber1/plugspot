import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the logo and brand name', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('PlugSpot')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Browse Chargers/i)).toBeInTheDocument();
    expect(screen.getAllByText(/List/i).length).toBeGreaterThan(0);
  });

  it('has correct links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    
    const browseLink = screen.getByText(/Browse Chargers/i).closest('a');
    expect(browseLink).toHaveAttribute('href', '/browse');
  });
});
