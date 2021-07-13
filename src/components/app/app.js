import styles from "./app.module.css";

import cn from "classnames";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProfilePage,
  NotFound404,
} from "../../pages";
import AppHeader from "../app-header/app-header";
import { ProtectedRoute } from "../protected-route";
import { UnauthorizedRoute } from "../unauthorized-route";

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <AppHeader />
        <main className={styles.main}>
          <Switch>
            <Route path="/login" exact={true}>
              <LoginPage />
            </Route>
            <UnauthorizedRoute path="/register" exact={true}>
              <RegisterPage />
            </UnauthorizedRoute>
            <UnauthorizedRoute path="/forgot-password" exact={true}>
              <ForgotPasswordPage />
            </UnauthorizedRoute>
            <UnauthorizedRoute path="/reset-password" exact={true}>
              <ResetPasswordPage />
            </UnauthorizedRoute>
            <Route path="/" exact={true}>
              <HomePage />
            </Route>
            <ProtectedRoute path="/profile">
              <ProfilePage />
            </ProtectedRoute>
            {/*
            <ProtectedRoute path={`/list/:country`} exact={true}>
              <CountryPage />
            </ProtectedRoute>
            <ProtectedRoute path={`/list/:country/:personId`} exact={true}>
              <PersonPage />
            </ProtectedRoute> 
            */}
            <Route>
              <NotFound404 />
            </Route>
          </Switch>
        </main>
      </Router>
    </div>
  );
}

export default App;
