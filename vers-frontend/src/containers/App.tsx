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
        : s
    );
  }, [feedback, submitting, error]);

  const handleClose = () => {
    dispatch(clearFeedback());
    setNoteState({ ...noteState, open: false });
  };

  React.useEffect(() => {
    dispatch(initLogin());
  }, [dispatch]);

  k.trigger = () => { dispatch(reload()); };

  if (auth === undefined) return <SpinningBall />;
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route exact path='/'>
          {auth ? (
            pId ? (
              <Redirect to='/dashboard' />
            ) : (
              <Redirect to='/plants' />
            )
          ) : (
            <Redirect to='/signin' />
          )}
        </Route>
        <Route exact path='/dashboard'>
          {auth ? (
            pId ? (
              <DashboardPage />
            ) : (
              <Redirect to='/plants' />
            )
          ) : (
            <Redirect to='/' />
          )}
        </Route>
        <Route exact path='/plants'>
          {auth ? <PlantPage /> : <Redirect to='/' />}
        </Route>
        <Route exact path='/access_ctrl'>
          {auth ? <AccessCtrlPage /> : <Redirect to='/'/>}
        </Route>
        <Route exact path='/user'>
          {auth ? <ProfilePage /> : <Redirect to='/' />}
        </Route>
        <Route exact path='/user_edit'>
          {auth ? <UserEditPage /> : <Redirect to='/' />}
        </Route>
        <Route exact path='/signin'>
          <SigninPage />
        </Route>
        <Redirect to='/' />
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
