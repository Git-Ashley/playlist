import React, { useEffect, useState } from 'react';
import { Route, Redirect, Switch, BrowserRouter } from "react-router-dom";
import styled from 'styled-components';
import Course from 'features/course';
import apiFetch from 'util/apiFetch';
import apiRoutes from 'app/apiRoutes';
import { UserProvider } from 'app/UserContext';

const AppContainer = styled.div`
  height: 100%;
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
          <div>App Header</div>
          <Switch>
            <Route path="/course/:courseId">
              <Course />
            </Route>
            <Redirect to="/course/5ebc9e10f8144bff47de9cc8" />
          </Switch>
        </UserProvider>
      </BrowserRouter>
    </AppContainer>
  );
}