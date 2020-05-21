import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CardViewer from 'features/cardViewer';
import apiFetch from 'util/apiFetch';
import apiRoutes from 'app/apiRoutes';
import { UserProvider } from 'app/UserContext';

const AppContainer = styled.div`
`;

export default () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch(apiRoutes.login(), {
      username: 'rooster356'
    }).then(user => console.log('user res:', user) || setUser(user));
  }, []);

  return (
    <AppContainer>
      <UserProvider user={user}>
        <div>App container</div>
        <CardViewer />
      </UserProvider>
    </AppContainer>
  );
}