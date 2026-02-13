import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from '../ToastContext';

const TestComponent = () => {
  const { showToast } = useToast();
  
  return (
    <button onClick={() => showToast('Test message', 'success')}>
      Show Toast
    </button>
  );
};

describe('ToastContext', () => {
  it('provides toast functionality', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Toast');
    expect(button).toBeInTheDocument();
  });

  it('displays toast message when showToast is called', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Toast');
    button.click();
    
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
  });

  it('removes toast after timeout', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const button = screen.getByText('Show Toast');
    button.click();
    
    // Verify toast appears
    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });
    
    // Wait for timeout (3 seconds) and verify toast disappears
    await waitFor(
      () => {
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();
      },
      { timeout: 4000 }
    );
  });
});
