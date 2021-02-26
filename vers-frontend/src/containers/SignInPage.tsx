import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { login } from "src/slices/session";
import { useHistory } from "react-router";
import { getSession } from "src/selectors";

import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import { green, purple } from "@material-ui/core/colors";
import Container from "@material-ui/core/Container";

import SignInForm from "src/components/forms/SignInForm";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://se.com/">
        Schneider Electric
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: purple,
  },
});

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SignIn: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { authenticated: auth, feedback } = useSelector(getSession);

  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    setOpen(!!feedback);
  }, [feedback, auth]);
  const handleClose = (e: React.ChangeEvent<any>) => {
    setOpen(false);
  };

  const handleSubmit = (data: any) => {
    dispatch(
      login({
        username: data.username,
        password: data.password,
        remember: data.remember,
      })
    );
    history.push("/");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <div>
            <SignInForm onSubmit={handleSubmit} feedback={feedback} />
          </div>
          {/*
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>*/}
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={!feedback ? "success" : "error"}
          >
            {!feedback ? "Successful" : "Wrong Username/Password"}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
