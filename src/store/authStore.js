import instance from 'src/helper/instance';
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        token: null,
        error: null,
        login: async (email, pass) => {
          set({ error: null, message: null }); // reset error state before making the request
          try {
            const { data } = await instance.post('/auth/login', { email, pass });
            set({ token: data.data.accessToken });
          } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed' });
          }
        },
        logout: () => set({ token: null }),
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-store',
      }
    )
  )
);

export default useAuthStore;
