import styles from "./app.module.css";

import {
  Switch,
  Route,
  useLocation,
  useHistory,
  useRouteMatch,
} from "react-router-dom";

import { Location } from "history";

import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ProfilePage,
  OrderPage,
  FeedPage,
  IngredientPage,
  NotFound404,
} from "../../pages";
import AppHeader from "../app-header/app-header";
import { ProtectedRoute } from "../protected-route";
import { UnauthorizedRoute } from "../unauthorized-route";
import IngredientDetailsModal from "../ingredient-details-modal/ingredient-details-modal";
import OrderInfoModal from "../order-info-modal/order-info-modal";

const App: React.FC = () => {
  const location = useLocation<{ background?: Location }>();
  // для gh-pages : при перезагрузке страницы не подхватывается URL текущей страницы. Кладем его в ?p=/feed
  const customPath = new URLSearchParams(location.search).get("p");
  const customLocation = customPath
    ? ({ pathname: customPath } as Location)
    : null;
  const history = useHistory();
  const background = history.action === "PUSH" && location.state?.background;
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Switch location={background || customLocation || location}>
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
            <OrderPage />
          </ProtectedRoute>
          <ProtectedRoute path="/profile">
            <ProfilePage />
          </ProtectedRoute>
          <Route path="/feed/:id" exact={true}>
            <OrderPage />
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
      {background && (
        <Route path="/profile/orders/:id">
          <OrderInfoModal />
        </Route>
      )}
      {background && (
        <Route path="/feed/:id">
          <OrderInfoModal />
        </Route>
      )}
    </div>
  );
};

export default App;
