import { useAuth } from "../services/auth";
import { Redirect, Route } from "react-router-dom";

export function UnauthorizedRoute({ children, ...rest }) {
  let { user, userLoaded } = useAuth();

  if (!userLoaded) {
    return null;
  }

  return (
    <Route {...rest} render={() => (user ? <Redirect to="/" /> : children)} />
  );
}
