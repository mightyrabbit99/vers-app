import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { UserData } from "src/kernel/data/UserData";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface FormData {
  username: string;
  password: string;
  [name: string]: any;
}

interface FormProps {
  user?: UserData;
  feedback?: any;
  onSubmit: (data: FormData) => void;
}

const SignInForm: React.FC<FormProps> = (props) => {
  const classes = useStyles();
  const { onSubmit, feedback: fb, user } = props;

  const [data, setData] = React.useState<FormData>({
    username: user ? user.username : "",
    password: "",
    remember: false,
  });
  const [feedback, setFeedback] = React.useState(fb ?? {});
  React.useEffect(() => {
    setFeedback(fb ?? {});
  }, [fb]);

  const getFeedback = (name: string) => {
    return feedback[name] ?? "";
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    let { name, value, checked } = e.target;

    if (name === "remember") {
      value = checked;
    }
    setFeedback({ ...feedback, [name]: undefined });
    setData({ ...data, [name]: value });
  };

  const genActiveProps = (name: string) => ({
    name,
    value: data[name],
    onChange: handleChange,
  });

  const genProps = (name: string) => ({
    ...genActiveProps(name),
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  const handleClick = () => {
    onSubmit(data);
  };

  return (
    <React.Fragment>
      <FormControl className={classes.form} component="fieldset">
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Username"
          autoComplete="username"
          autoFocus
          {...genProps("username")}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          inputProps={{
            autoComplete: "new-password",
          }}
          {...genProps("password")}
        />
        <FormHelperText>{getFeedback("non_field_errors")}</FormHelperText>
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={handleClick}
      >
        Ok
      </Button>
    </React.Fragment>
  );
};

export default SignInForm;
