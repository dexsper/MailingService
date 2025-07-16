'use client';

import { ReactNode, createContext, useContext } from 'react';

import { User } from '@/types/user';

const UserContext = createContext<User>(undefined as never);

export const UserProvider = ({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
