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
  ProfileOrderPage,
  FeedPage,
  FeedOrderPage,
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
            <Route path="/" exact={true}>
              <HomePage />
            </Route>
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
            <ProtectedRoute path="/profile/orders/:id" exact={true}>
              <ProfileOrderPage />
            </ProtectedRoute>
            <ProtectedRoute path="/profile">
              <ProfilePage />
            </ProtectedRoute>
            <Route path="/feed/:id" exact={true}>
              <FeedOrderPage />
            </Route>
            <Route path="/feed" exact={true}>
              <FeedPage />
            </Route>
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
