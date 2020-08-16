import React, { useState } from 'react';
import { Route, Redirect, Switch, BrowserRouter } from "react-router-dom";
import AuthRoute from 'components/customRoutes/AuthRoute';
import styled from 'styled-components';
import Course from 'features/course';
import Login from 'app/Login';
import { UserProvider } from 'app/UserContext';

const COURSE_ID = '5ebc9e10f8144bff47de9cc8';

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

  return (
    <AppContainer>
      <BrowserRouter>
        <UserProvider user={user} setUser={setUser}>
          <AppHeader>App Header</AppHeader>
          <AppContent>
            <Switch>
              <AuthRoute exact path='/'>HOME.</AuthRoute>
              <AuthRoute path="/course/:courseId">
                <Course />
              </AuthRoute>
              <AuthRoute path="/user/profile">
                <div>User manijment page!</div>
              </AuthRoute>
              { (!user || !user._id) && (
                <Route path="/login">
                  <Login onLoginSuccess={setUser} />
                </Route>
              )}
              <Redirect to={`/course/${COURSE_ID}`} />
            </Switch>
          </AppContent>
        </UserProvider>
      </BrowserRouter>
    </AppContainer>
  );
}