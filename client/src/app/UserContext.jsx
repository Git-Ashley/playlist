import React, { createContext, useContext } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ user, setUser, children }) => (
  <UserContext.Provider value={[user, setUser]}>
    {children}
  </UserContext.Provider>
);

export const useUser = () => useContext(UserContext);