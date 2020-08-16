import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { useUser } from "app/UserContext";

export default ({ component: Component, children, ...rest }) => {
  const [user] = useUser();

  return (<Route {...rest} render={props => (
    !user || !user._id ? (
      <Redirect to="/login" />
    ) : (
      Component ? <Component {...props} /> : children
    )
  )} />);
}