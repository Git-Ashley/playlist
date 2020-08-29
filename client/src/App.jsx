import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch, Link, BrowserRouter } from "react-router-dom";
import AuthRoute from 'components/customRoutes/AuthRoute';
import styled from 'styled-components';
import Course from 'features/course';
import Login from 'features/Login';
import { UserProvider } from 'app/UserContext';
import UserProfile from 'features/userProfile';
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';
import LoadingPlaceholder from 'components/molecules/LoadingPlaceholder';

// TODO styled components theme
window.COURSE_TAG_COLOR = '#f1b14c';
window.USER_TAG_COLOR = '#9ec8d2';

// Screen sizes
window.LARGE = 992;

const COURSE_ID = '5ebc9e10f8144bff47de9cc8';

const AppContainer = styled.div`
  height: 100%;
  background: #e0c299;
`;

const AppHeader = styled.div`
  height: 50px;
  background-color: #d4c0a5;
`;

const AppContent = styled.div`
  height: calc(100% - 50px);
`;

export default () => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    apiFetch(apiRoutes.relogin()).then(user => {
      setUser(user);
      setIsLoadingUser(false);
    });
  }, []);

  if (isLoadingUser) {
    return <LoadingPlaceholder />;
  }

  return (
    <AppContainer>
      <BrowserRouter>
        <UserProvider user={user} setUser={setUser}>
          <AppHeader>
            <Link to="/user/profile">User</Link>
          </AppHeader>
          <AppContent>
            <Switch>
              <AuthRoute exact path='/'>HOME.</AuthRoute>
              <AuthRoute path="/course/:courseId">
                <Course />
              </AuthRoute>
              <AuthRoute path="/user/profile">
                <UserProfile user={user} />
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
