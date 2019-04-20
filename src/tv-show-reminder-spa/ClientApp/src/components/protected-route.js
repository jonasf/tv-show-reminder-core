import React from "react";
import { Route, Redirect } from "react-router-dom";

function isAuthenticated() {
  let user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.token || !user.tokenExpirationTime) {
    return false;
  }

  var expirationTime = new Date(user.tokenExpirationTime * 1000);
  var now = new Date();
  if (now < expirationTime) {
    return true;
  }

  return false;
}

export const ProtectedRoute = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (isAuthenticated()) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/authentication",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};