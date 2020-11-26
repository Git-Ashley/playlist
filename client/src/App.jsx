import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch, Link, BrowserRouter } from "react-router-dom";
import AuthRoute from 'components/customRoutes/AuthRoute';
import styled, { ThemeProvider } from 'styled-components';
import Course from 'features/course';
import Home from 'features/home';
import AppHeader from 'features/AppHeader';
import { UserProvider } from 'app/UserContext';
import UserProfile from 'features/userProfile';
import apiRoutes from 'app/apiRoutes';
import apiFetch from 'util/apiFetch';
import LoadingPlaceholder from 'components/molecules/LoadingPlaceholder';
import { defaultTheme } from 'app/theme';
import GuestLogin from 'features/GuestLogin';

const COURSE_ID = '5ebc9e10f8144bff47de9cc8';

const AppContainer = styled.div`
  height: 100%;
  background: ${props => props.theme.mainBackground};
`;

const AppContent = styled.div`
  height: calc(100% - ${props => props.theme.headerHeight}px);
`;

const CourseRoutes = () => {

}

export default () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(defaultTheme);
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
    <ThemeProvider theme={theme}>
      <AppContainer>
        <BrowserRouter>
          <UserProvider user={user} setUser={setUser}>
            <AppHeader setTheme={setTheme} />
            <AppContent>
              <Switch>
                <AuthRoute exact path='/'>
                  <Home />
                </AuthRoute>
                <AuthRoute path="/course/:courseId">
                  <Course />
                </AuthRoute>
                <AuthRoute path="/user/profile">
                  <UserProfile user={user} />
                </AuthRoute>
                { (!user || !user._id) && (
                  <Route path="/login">
                    <GuestLogin onLoginSuccess={setUser} />
                  </Route>
                )}
                <Redirect to={`/course/${COURSE_ID}`} />
              </Switch>
            </AppContent>
          </UserProvider>
        </BrowserRouter>
      </AppContainer>
    </ThemeProvider>
  );
}
