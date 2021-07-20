import styles from "./app.module.css";

import { Switch, Route, useLocation } from "react-router-dom";

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
  IngredientPage,
  NotFound404,
} from "../../pages";
import AppHeader from "../app-header/app-header";
import { ProtectedRoute } from "../protected-route";
import { UnauthorizedRoute } from "../unauthorized-route";
import IngredientDetailsModal from "../ingredient-details-modal/ingredient-details-modal";

function App() {
  const location = useLocation();
  const background = location.state?.background;
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Switch location={background || location}>
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
          <Route path="/ingredients/:id" exact={true}>
            <IngredientPage />
          </Route>
          <Route>
            <NotFound404 />
          </Route>
        </Switch>
      </main>
      {background && (
        <Route path="/ingredients/:id">
          <IngredientDetailsModal />
        </Route>
      )}
    </div>
  );
}

export default App;
