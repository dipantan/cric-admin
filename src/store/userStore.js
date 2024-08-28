import { create } from 'zustand';
import instance from 'src/helper/instance';
import { devtools } from 'zustand/middleware';

const useUserStore = create((set) => ({
  users: [],
  error: null,
  fetchUsers: async () => {
    try {
      const { data } = await instance.get('/user');
      set({ users: data.data });
    } catch (error) {
      set({ error: error.response?.data?.message || 'No users found' });
    }
  },
}));

export default useUserStore;
