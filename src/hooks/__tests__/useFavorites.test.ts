import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavorites } from '../useFavorites';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty favorites', () => {
    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite('1')).toBe(false);
  });

  it('loads favorites from localStorage', () => {
    localStorage.setItem('plugspot_favorites', JSON.stringify(['1', '2']));
    
    const { result } = renderHook(() => useFavorites());
    
    expect(result.current.favorites).toEqual(['1', '2']);
    expect(result.current.isFavorite('1')).toBe(true);
    expect(result.current.isFavorite('2')).toBe(true);
    expect(result.current.isFavorite('3')).toBe(false);
  });

  it('toggles favorite status', () => {
    const { result } = renderHook(() => useFavorites());
    
    act(() => {
      result.current.toggleFavorite('1');
    });
    
    expect(result.current.isFavorite('1')).toBe(true);
    expect(result.current.favorites).toContain('1');
    
    act(() => {
      result.current.toggleFavorite('1');
    });
    
    expect(result.current.isFavorite('1')).toBe(false);
    expect(result.current.favorites).not.toContain('1');
  });

  it('saves favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites());
    
    act(() => {
      result.current.toggleFavorite('1');
      result.current.toggleFavorite('2');
    });
    
    const stored = localStorage.getItem('plugspot_favorites');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual(['1', '2']);
  });
});
