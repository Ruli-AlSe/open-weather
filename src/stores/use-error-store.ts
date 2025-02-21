import { ErrorsActions, ErrorsState } from '@/lib/definitions/requests';
import { create } from 'zustand';

export const useErrorStore = create<ErrorsState & ErrorsActions>((set) => ({
  errors: [],
  setError: (newError) => set((state) => ({ errors: [...state.errors, newError] })),
  removeErrors: () => set(() => ({ errors: [] })),
}));
