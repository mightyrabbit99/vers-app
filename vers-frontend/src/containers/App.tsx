import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { green, purple } from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import SigninPage from "./SignInPage";
import DashboardPage from "./DashboardPage";
import SpinningBall from "./SpinningBall";
import ProfilePage from "./ProfilePage";
import UserEditPage from "./UserEditPage";
import PlantPage from "./PlantPage";
import AccessCtrlPage from "./AccessCtrlPage";

import { getData, getSession, getSync } from "src/selectors";
import { reload } from "src/slices/data";
import { initLogin } from "src/slices/session";
import k from "src/kernel";

interface IAppProps {}

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: purple,
  },
});

const App: React.FC<IAppProps> = () => {
  const dispatch = useDispatch();
  const { authenticated: auth, syncing } = useSelector(getSession);
  const { selectedPlantId: pId } = useSelector(getData);
  const { error } = useSelector(getSync);

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(!!error);
  }, [error]);

  const handleClose = () => { setOpen(false); }

  k.trigger = () => {
    dispatch(reload());
  };

  React.useEffect(() => {
    dispatch(initLogin());
  }, [dispatch]);

  if (auth === undefined || syncing) return <SpinningBall />;
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path="/">
          {auth ? (
            pId ? (
              <Redirect to="/dashboard" />
            ) : (
              <Redirect to="/plants" />
            )
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
        <Route exact path="/dashboard">
          {auth ? (
            pId ? (
              <DashboardPage />
            ) : (
              <Redirect to="/plants" />
            )
          ) : (
            <Redirect to="/" />
          )}
        </Route>
        <Route exact path="/plants">
          {auth ? <PlantPage /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/access_ctrl">
          {auth ? <AccessCtrlPage /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/user">
          {auth ? <ProfilePage /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/user_edit">
          {auth ? <UserEditPage /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/signin">
          <SigninPage />
        </Route>
      </Switch>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={"error"}>
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
