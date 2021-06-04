import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { green, purple } from "@material-ui/core/colors";
import Snackbar from "@material-ui/core/Snackbar";
import Alert, { Color } from "@material-ui/lab/Alert";

import SigninPage from "./SignInPage";
import DashboardPage from "./DashboardPage";
import SpinningBall from "./SpinningBall";
import ProfilePage from "./ProfilePage";
import UserEditPage from "./UserEditPage";
import PlantPage from "./PlantPage";
import AccessCtrlPage from "./AccessCtrlPage";

import { getData, getSession, getSync } from "src/selectors";
import { initLogin } from "src/slices/session";
import { clearFeedback } from "src/slices/sync";
import k from "src/kernel";
import { reload } from "src/slices/data";
import Path from "src/kernel/Path";

interface IAppProps {}

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: purple,
  },
});

interface NoteState {
  open: boolean;
  ready: boolean;
  message: string;
  severity: Color;
}

const initNoteState: NoteState = {
  open: false,
  ready: false,
  message: "",
  severity: "error",
};

const App: React.FC<IAppProps> = (props) => {
  const dispatch = useDispatch();
  const { authenticated: auth } = useSelector(getSession);
  const { selectedPlantId: pId } = useSelector(getData);
  const { error, feedback, syncing: submitting } = useSelector(getSync);

  const [noteState, setNoteState] = React.useState<NoteState>(initNoteState);
  React.useEffect(() => {
    error &&
      setNoteState({
        open: true,
        ready: false,
        message: error.message ?? "",
        severity: "error",
      });
  }, [error]);

  React.useEffect(() => {
    setNoteState((s) =>
      submitting
        ? { ...s, ready: true }
        : !error && s.ready && !feedback
        ? {
            open: !feedback,
            ready: false,
            message: "Success",
            severity: "success",
          }
        : { ...s, ready: false }
    );
  }, [feedback, submitting, error]);

  const handleClose = () => {
    feedback && feedback && dispatch(clearFeedback());
    setNoteState({ ...noteState, open: false });
  };

  React.useEffect(() => {
    dispatch(initLogin());
  }, [dispatch]);

  k.trigger = () => {
    dispatch(reload(false));
  };

  if (auth === undefined) return <SpinningBall />;
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path={Path.ROOT_PATH}>
          {auth ? (
            pId ? (
              <Redirect to={Path.DASHBOARD_PATH} />
            ) : (
              <Redirect to={Path.PLANTS_PATH} />
            )
          ) : (
            <Redirect to={Path.SIGNIN_PATH} />
          )}
        </Route>
        <Route exact path={Path.DASHBOARD_PATH}>
          {auth ? (
            pId ? (
              <DashboardPage />
            ) : (
              <Redirect to={Path.PLANTS_PATH} />
            )
          ) : (
            <Redirect to={Path.ROOT_PATH} />
          )}
        </Route>
        <Route exact path={Path.PLANTS_PATH}>
          {auth ? <PlantPage /> : <Redirect to={Path.ROOT_PATH} />}
        </Route>
        <Route exact path={Path.ACCESS_CTRL_PATH}>
          {auth ? <AccessCtrlPage /> : <Redirect to={Path.ROOT_PATH} />}
        </Route>
        <Route exact path={Path.USER_PATH}>
          {auth ? <ProfilePage /> : <Redirect to={Path.ROOT_PATH} />}
        </Route>
        <Route exact path={Path.USER_EDIT_PATH}>
          {auth ? <UserEditPage /> : <Redirect to={Path.ROOT_PATH} />}
        </Route>
        <Route exact path={Path.SIGNIN_PATH}>
          {auth ? <Redirect to={Path.ROOT_PATH} /> : <SigninPage />}
        </Route>
      </Switch>
      <Snackbar
        open={noteState.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={noteState.severity}>
          {noteState.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
