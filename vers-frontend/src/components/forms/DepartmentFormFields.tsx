import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { Department } from "src/kernel";
import { commonFormFieldStyles } from "./types";


const useStyles = makeStyles(commonFormFieldStyles);

interface IDepartmentFFProps {
  data: Department;
  feedback?: any;
  onChange?: (data: Department) => void;
}

const DepartmentFF: React.FunctionComponent<IDepartmentFFProps> = (props) => {
  const classes = useStyles();
  const { data, feedback: fb, onChange } = props;
  const [state, setState] = React.useState(data);
  const [feedback, setFeedback] = React.useState(fb ?? {});
  React.useEffect(() => {
    setFeedback(fb ?? {});
  }, [fb]);
  React.useEffect(() => {
    setState(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    data[name] = value;
    setFeedback({ ...feedback, [name]: undefined });
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const getFeedback = (name: string) => {
    return feedback[name] ?? "";
  };

  const genActiveProps = (name: string) => ({
    name,
    value: state[name],
    onChange: handleChange,
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container className={classes.form}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            {...genActiveProps("name")}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default DepartmentFF;
