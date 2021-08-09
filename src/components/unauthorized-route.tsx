import { useAuth } from "../services/auth";
import { Redirect, Route, RouteProps } from "react-router-dom";
import Spinner from "./spinner/spinner";

interface IUnauthorizedRouteProps extends RouteProps {
  children: React.ReactNode;
}

export function UnauthorizedRoute({
  children,
  ...rest
}: IUnauthorizedRouteProps) {
  const { user, userLoaded } = useAuth();

  if (!userLoaded) {
    return <Spinner center={true} />;
  }

  return (
    <Route {...rest} render={() => (user ? <Redirect to="/" /> : children)} />
  );
}
