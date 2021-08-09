import { useAuth } from "../services/auth";
import { Redirect, Route, RouteProps } from "react-router-dom";
import React from "react";

interface IProtectedRouteProps extends RouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children, ...rest }: IProtectedRouteProps) {
  let { user, userLoaded } = useAuth();

  if (!userLoaded) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
