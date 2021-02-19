import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { green, purple } from "@material-ui/core/colors";
import SigninPage from "./SignInPage";
import DashboardPage from "./DashboardPage";
import { getSession } from "src/selectors";
import { initLogin } from "src/slices/session";
import SpinningBall from "./SpinningBall";
import ProfilePage from "./ProfilePage";
import UserEditPage from "./UserEditPage";

interface IAppProps {}

interface MainRouteProps {
  auth?: boolean;
  type: string;
  [name: string]: any;
}

const MainRoute: React.FC<MainRouteProps> = (props) => {
  const { auth, type, ...otherProps } = props;
  if (type === "guest" && auth) return <Redirect to="/" />;
  if (type === "private" && !auth) return <Redirect to="/" />;

  return <Route {...otherProps} />;
};

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: purple,
  },
});

const App: React.FC<IAppProps> = () => {
  const dispatch = useDispatch();
  const { authenticated: auth, syncing } = useSelector(getSession);

  React.useEffect(() => {
    dispatch(initLogin());
  }, []);

  if (auth === undefined || syncing) return <SpinningBall />;
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/">
          {auth ? <Redirect to="/dashboard" /> : <Redirect to="signin" />}
        </Route>
        <MainRoute
          exact
          auth={auth}
          type="private"
          path="/dashboard"
          render={() => <DashboardPage />}
        />
        <MainRoute
          exact
          auth={auth}
          type="private"
          path="/user"
          render={() => <ProfilePage />}
        />
        <MainRoute
          exact
          auth={auth}
          type="private"
          path="/user_edit"
          render={() => <UserEditPage />}
        />
        <MainRoute
          exact
          auth={auth}
          type="guest"
          path="/signin"
          component={() => <SigninPage />}
        />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
