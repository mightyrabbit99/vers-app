import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import { Subsector } from "src/kernel";
import { commonFormFieldStyles, FormChoiceField, FormChoices } from "./types";

const useStyles = makeStyles(commonFormFieldStyles);

interface SubsectorFormChoices extends FormChoices {
  sector: FormChoiceField;
}

interface ISubsectorFFProps {
  data: Subsector;
  choices: SubsectorFormChoices;
  feedback?: any;
  onChange?: (data: Subsector) => void;
}

const SubsectorFF: React.FC<ISubsectorFFProps> = (props) => {
  const classes = useStyles();
  const { data, choices, feedback: fb, onChange } = props;
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

    if (name === "sector") {
      value = parseInt(value, 10);
      choices[name].init = value;
      value = choices[name].choices[value].value;
    }

    data[name as keyof Subsector] = value as never;
    setFeedback(feedback ? { ...feedback, [name]: undefined } : undefined);
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const getFeedback = (name: keyof Subsector) => {
    return (feedback && name in feedback) ? feedback[name] ?? "" : "";
  };

  const getDataProp = (name: keyof Subsector) => {
    if (name === "sector") {
      return choices[name].init === -1 ? "" : choices[name].init;
    }
    return state[name];
  };

  const numValueSetter = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;
    let num = parseFloat(value);
    value = isNaN(num) ? 0 : num;
    data[name as keyof Subsector] = value as never;
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const genProps = (name: keyof Subsector) => ({
    name,
    value: getDataProp(name),
    onChange: handleChange,
    error: getFeedback(name) !== "",
  });

  const genActiveProps = (name: keyof Subsector) => ({
    ...genProps(name),
    helperText: getFeedback(name),
    InputLabelProps: {
      shrink: getDataProp(name) !== "",
    },
  });

  return (
    <form noValidate autoComplete="off" className={classes.root}>
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            {...genActiveProps("name")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Sector</InputLabel>
            <Select labelId="demo-simple-select-label" {...genProps("sector")}>
              {choices["sector"].choices.map((x, idx) => (
                <MenuItem key={idx} value={idx}>
                  {x.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Unit" {...genActiveProps("unit")} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Cycle Time (min/unit)"
            variant="filled"
            {...genActiveProps("cycleTime")}
            onBlur={numValueSetter}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Efficiency (%)"
            variant="filled"
            {...genActiveProps("efficiency")}
            onBlur={numValueSetter}
            type="number"
          />
        </Grid>
      </Grid>
    </form>
  );
};

export type { SubsectorFormChoices };
export default SubsectorFF;
