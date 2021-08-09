import { useAuth } from "../services/auth";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface IUnauthorizedRouteProps extends RouteProps {
  children: React.ReactNode;
}

export function UnauthorizedRoute({
  children,
  ...rest
}: IUnauthorizedRouteProps) {
  let { user, userLoaded } = useAuth();

  if (!userLoaded) {
    return null;
  }

  return (
    <Route {...rest} render={() => (user ? <Redirect to="/" /> : children)} />
  );
}
