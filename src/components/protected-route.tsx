import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useAuth } from "../services/auth";
import Spinner from "./spinner/spinner";

interface IProtectedRouteProps extends RouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children, ...rest }: IProtectedRouteProps) {
  let { user, userLoaded } = useAuth();

  if (!userLoaded) {
    return <Spinner center={true} />;
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
