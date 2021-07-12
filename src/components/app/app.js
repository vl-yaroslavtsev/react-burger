import styles from "./app.module.css";

import cn from "classnames";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  NotFound404,
} from "../../pages";
import AppHeader from "../app-header/app-header";

function App() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Router>
          <Switch>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/register">
              <RegisterPage />
            </Route>
            <Route path="/forgot-password">
              <ForgotPasswordPage />
            </Route>
            <Route path="/reset-password">
              <ResetPasswordPage />
            </Route>
            <Route path="/" exact={true}>
              <HomePage />
            </Route>
            {/* <ProtectedRoute path="/list" exact={true}>
              <ListPage />
            </ProtectedRoute>
            <ProtectedRoute path={`/list/:country`} exact={true}>
              <CountryPage />
            </ProtectedRoute>
            <ProtectedRoute path={`/list/:country/:personId`} exact={true}>
              <PersonPage />
            </ProtectedRoute> */}
            <Route>
              <NotFound404 />
            </Route>
          </Switch>
        </Router>
      </main>
    </div>
  );
}

export default App;
