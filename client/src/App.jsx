import React, { useEffect, useState } from 'react';
import { Route, Redirect, Switch, BrowserRouter } from "react-router-dom";
import styled from 'styled-components';
import Course from 'features/course';
import apiFetch from 'util/apiFetch';
import apiRoutes from 'app/apiRoutes';
import { UserProvider } from 'app/UserContext';

const AppContainer = styled.div`
  height: 100%;
  background: #d8bc7a;
`;

const AppHeader = styled.div`
  height: 50px;
  background: #caaf70;
`;

const AppContent = styled.div`
  height: calc(100% - 50px);
`;

export default () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch(apiRoutes.login(), {
      username: 'rooster356'
    }).then(user => setUser(user));
  }, []);

  return (
    <AppContainer>
      <BrowserRouter>
        <UserProvider user={user}>
          <AppHeader>App Header</AppHeader>
          <AppContent>
            <Switch>
              <Route path="/course/:courseId">
                <Course />
              </Route>
              <Redirect to="/course/5ebc9e10f8144bff47de9cc8" />
            </Switch>
          </AppContent>
        </UserProvider>
      </BrowserRouter>
    </AppContainer>
  );
}