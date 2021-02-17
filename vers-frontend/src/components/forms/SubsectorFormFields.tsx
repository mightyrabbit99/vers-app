import * as React from "react";
import {
  makeStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@material-ui/core";
import { Subsector } from "src/kernel";
import { FormChoiceField, FormChoices } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

interface SubsectorFormChoices extends FormChoices {
  sector: FormChoiceField;
}

interface ISubsectorFFProps {
  data: Subsector;
  choices: SubsectorFormChoices;
  feedback?: any;
  onChange?: (data: Subsector) => void;
}

const SubsectorFF: React.FunctionComponent<ISubsectorFFProps> = (props) => {
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

    data[name] = value;
    setFeedback({...feedback, [name]: undefined});
    onChange ? onChange(data) : setState({...state, [name]: value});
  };

  const getFeedback = (name: string) => {
    return feedback[name] ?? "";
  };

  const getDataProp = (name: string) => {
    if (name === "sector") {
      return choices[name].init === -1 ? "" : choices[name].init;
    }
    return state[name];
  };

  const numValueSetter = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;
    let num = parseInt(value, 10);
    value = isNaN(num) ? 0 : num;
    data[name] = value;
    onChange ? onChange(data) : setState({...state, [name]: value});
  };

  const genProps = (name: string) => ({
    name,
    value: getDataProp(name),
    onChange: handleChange,
  })

  const genActiveProps = (name: string) => ({
    ...genProps(name),
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            variant="outlined"
            {...genActiveProps("name")}
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Plant</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              {...genProps("sector")}
            >
              {choices["sector"].choices.map((x, idx) => (
                <MenuItem key={idx} value={idx}>
                  {x.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Cycle Time"
            variant="filled"
            {...genActiveProps("cycleTime")}
            onBlur={numValueSetter}
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Efficiency"
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
