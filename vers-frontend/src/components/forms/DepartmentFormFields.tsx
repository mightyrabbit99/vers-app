import * as React from "react";
import { makeStyles, TextField } from "@material-ui/core";
import { Department } from "src/kernel";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

interface IDepartmentFFProps {
  data: Department;
  feedback?: any;
  onChange?: (data: Department) => void;
}

const DepartmentFF: React.FunctionComponent<IDepartmentFFProps> = (props) => {
  const classes = useStyles();
  const { data, feedback : fb, onChange } = props;
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
    setFeedback({...feedback, [name]: undefined});
    onChange ? onChange(data) : setState({...state, [name]: value});
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
      <TextField label="Name" variant="outlined" {...genActiveProps("name")} />
    </form>
  );
};

export default DepartmentFF;
