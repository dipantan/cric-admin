import { create } from 'zustand';
import instance from 'src/helper/instance';
import { devtools } from 'zustand/middleware';

const usePlayerStore = create((set) => ({
  players: [],
  topPlayers: [],
  recommendedPlayers: [],
  error: null,
  message: null,
  fetchPlayers: async (limit = 10, page = 1, search = '') => {
    try {
      const { data } = await instance.get('/player', {
        params: {
          limit,
          page,
          search,
        },
      });
      set({ players: data.data });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No players found' });
    }
  },
  createRecommendedPlayer: async (id) => {
    try {
      const { data } = await instance.post('/player/create-recommended-players', { id });
      set({ players: data.message });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No players found' });
    }
  },
  createTopPlayers: async (id, type) => {
    try {
      const { data } = await instance.post('/player/create-top-players', { id, type });
      set({ players: data.message });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No players found' });
    }
  },
  fetchRecommendedPlayer: async () => {
    try {
      const { data } = await instance.get('/player/fetch-recommended-players');
      set({ recommendedPlayers: data.data });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No players found' });
    }
  },
  fetchTopPlayers: async () => {
    try {
      const { data } = await instance.get('/player/fetch-top-players');
      set({ topPlayers: data.data });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No players found' });
    }
  },
  clearError: () => set({ error: null }),
}));

export default usePlayerStore;
