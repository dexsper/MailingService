import { create } from 'zustand';

import { User } from '@/types/user';

interface UsersTableStore {
  users: User[];

  add: (user: User) => void;
  remove: (id: number) => void;
  setAll: (users: User[]) => void;
  clear: () => void;
}

export const useUsersTableStore = create<UsersTableStore>((set) => ({
  users: [],

  add: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  remove: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),

  setAll: (users) => set({ users }),

  clear: () => set({ users: [] }),
}));
