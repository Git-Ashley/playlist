import React, { createContext, useContext } from 'react';

const UserContext = createContext(null);

const temporaryHardcodedStuff = {
  courses: {
    '5ebc9e10f8144bff47de9cc8': {
      tags: ['test1', 'test2'],
      join_date: new Date(),
    }
  }
};

export const UserProvider = ({ user, children }) => (
  <UserContext.Provider value={{ ...user, ...temporaryHardcodedStuff }}>
    {children}
  </UserContext.Provider>
);

export const useUser = () => useContext(UserContext);