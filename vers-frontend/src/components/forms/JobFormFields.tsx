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
import { Job } from "src/kernel";
import { commonFormFieldStyles, FormChoiceField, FormChoices } from "./types";

const useStyles = makeStyles(commonFormFieldStyles);

interface JobFormChoices extends FormChoices {
  subsector: FormChoiceField;
}

interface IJobFFProps {
  data: Job;
  choices: JobFormChoices;
  feedback?: any;
  onChange?: (data: Job) => void;
}

const JobFF: React.FunctionComponent<IJobFFProps> = (props) => {
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

  const chg = (name: string, value: any) => {
    data[name] = value;
    setFeedback({...feedback, [name]: undefined});
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;

    if (name === "subsector") {
      value = parseInt(value, 10);
      choices[name].init = value;
      value = choices[name].choices[value].value;
    }

    chg(name, value);
  };

  const getFeedback = (name: string) => {
    return feedback[name] ?? "";
  };

  const getDataIdx = (name: string) => {
    return choices[name].init === -1 ? "" : choices[name].init;
  };

  const numValueSetter = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;
    let num = parseInt(value, 10);
    value = isNaN(num) ? 0 : num;
    chg(name, value);
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
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Title"
            variant="outlined"
            {...genActiveProps("title")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Subsector</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              name="subsector"
              error={getFeedback("subsector") !== ""}
              defaultValue={1}
              value={getDataIdx("subsector")}
              onChange={handleChange}
            >
              {choices["subsector"].choices.map((x, idx) => (
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
            label="Headcount Required"
            variant="filled"
            {...genActiveProps("pplAmtRequired")}
            onBlur={numValueSetter}
            type="number"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Salary"
            variant="filled"
            {...genActiveProps("salaryAmount")}
            onBlur={numValueSetter}
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="From"
            type="date"
            {...genActiveProps("fromDate")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="To"
            type="date"
            {...genActiveProps("toDate")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export type { JobFormChoices };
export default JobFF;
