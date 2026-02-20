import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('YGO Collection App', () => {
  describe('App Rendering', () => {
    it('renders the app header', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ collection: [], totalCards: 0, totalCopies: 0, totalValue: '0' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      expect(screen.getByText('🎴 YGO Collection')).toBeInTheDocument();
    });

    it('renders navigation tabs', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ collection: [], totalCards: 0, totalCopies: 0, totalValue: '0' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      expect(screen.getByText('My Collection')).toBeInTheDocument();
      expect(screen.getByText('Browse Sets')).toBeInTheDocument();
    });

    it('displays total value', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            collection: [], 
            totalCards: 0, 
            totalCopies: 0, 
            totalValue: '42.50' 
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      expect(screen.getByText('Total Value: $42.50')).toBeInTheDocument();
    });
  });

  describe('Collection View', () => {
    it('shows empty collection message', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ collection: [], totalCards: 0, totalCopies: 0, totalValue: '0' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      expect(screen.getByText('Your collection is empty! Add some cards.')).toBeInTheDocument();
    });

    it('renders collection cards', async () => {
      const mockCollection = [
        { name: 'Dark Magician', count: 2, cardId: 46986414, price: 10.00 },
        { name: 'Blue-Eyes White Dragon', count: 1, cardId: 89631139, price: 15.00 }
      ];

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ 
            collection: mockCollection, 
            totalCards: 2, 
            totalCopies: 3, 
            totalValue: '35.00' 
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      expect(screen.getByText('Dark Magician')).toBeInTheDocument();
      expect(screen.getByText('Blue-Eyes White Dragon')).toBeInTheDocument();
    });

    it('has add card form', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ collection: [], totalCards: 0, totalCopies: 0, totalValue: '0' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      expect(screen.getByPlaceholderText('Enter card name (e.g., Dark Magician)')).toBeInTheDocument();
    });

    it('can type in add card input', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ collection: [], totalCards: 0, totalCopies: 0, totalValue: '0' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      const input = screen.getByPlaceholderText('Enter card name (e.g., Dark Magician)');
      fireEvent.change(input, { target: { value: 'Dark Magician' } });
      
      expect(input).toHaveValue('Dark Magician');
    });
  });

  describe('Browse Sets View', () => {
    it('can switch to browse sets view', async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ collection: [], totalCards: 0, totalCopies: 0, totalValue: '0' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      const browseButton = screen.getByText('Browse Sets');
      fireEvent.click(browseButton);
      
      expect(screen.getByText('📚 Browse Sets')).toBeInTheDocument();
    });

    it('displays sets when browsing', async () => {
      const mockSets = [
        { name: 'Speed Duel', code: 'SBC1', year: '2021' },
        { name: 'Maximum Gold', code: 'MP24', year: '2024' }
      ];

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ collection: [], totalCards: 0, totalCopies: 0, totalValue: '0' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: mockSets })
        });

      await act(async () => {
        render(<App />);
      });
      
      const browseButton = screen.getByText('Browse Sets');
      fireEvent.click(browseButton);
      
      expect(screen.getByText('Speed Duel')).toBeInTheDocument();
      expect(screen.getByText('Maximum Gold')).toBeInTheDocument();
    });
  });

  describe('API Error Handling', () => {
    it('handles collection fetch error gracefully', async () => {
      (fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ sets: [] })
        });

      await act(async () => {
        render(<App />);
      });
      
      // Should still render even if collection fetch fails
      expect(screen.getByText('🎴 YGO Collection')).toBeInTheDocument();
    });
  });
});
