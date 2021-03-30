import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import { CalcVars } from "src/kernel";
import { commonFormFieldStyles } from "./types";

const useStyles = makeStyles(commonFormFieldStyles);

interface ICalcVarsFFProps {
  data: CalcVars;
  feedback?: any;
  onChange?: (data: CalcVars) => void;
}

const SectorFF: React.FC<ICalcVarsFFProps> = (props) => {
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
    let { name, value } = e.target;

    data[name] = value;
    setFeedback({ ...feedback, [name]: undefined });
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const handleIntChange = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;
    if (!/^\d*$/.test(value)) return;
    data[name] = value;
    setFeedback({ ...feedback, [name]: undefined });
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const getFeedback = (name: string) => {
    return feedback[name] ?? "";
  };

  const numValueSetter = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;
    let num = parseFloat(value);
    value = isNaN(num) ? 0 : num;
    data[name] = value;
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const genActiveProps = (
    name: string,
    hC: (e: React.ChangeEvent<any>) => void = handleChange
  ) => ({
    name,
    value: state[name],
    onChange: hC,
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container className={classes.form} spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Working Time (min) of an operator per day"
            {...genActiveProps("minPerDayPerOp", handleIntChange)}
            onBlur={numValueSetter}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Absentism"
            {...genActiveProps("absentism")}
            onBlur={numValueSetter}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Tea Break (min)"
            {...genActiveProps("teaBreak", handleIntChange)}
            onBlur={numValueSetter}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            required
            fullWidth
            label="# of Tea Break"
            {...genActiveProps("noTeaBreak", handleIntChange)}
            onBlur={numValueSetter}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Lunch Break (min)"
            {...genActiveProps("lunchBreak", handleIntChange)}
            onBlur={numValueSetter}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            required
            fullWidth
            label="# of Lunch Break"
            {...genActiveProps("noLunchBreak", handleIntChange)}
            onBlur={numValueSetter}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default SectorFF;
