import { useAuth } from "../services/auth";
import { Redirect, Route } from "react-router-dom";

export function ProtectedRoute({ children, ...rest }) {
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
