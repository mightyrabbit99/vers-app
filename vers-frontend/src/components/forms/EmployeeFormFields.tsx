import * as React from "react";
import {
  makeStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Button,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Employee } from "src/kernel";
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
  genderLabels: {
    display: "flex",
    flexDirection: "row",
  },
  department: {
    minWidth: "50%",
  },
  subsector: {},
  reportTo: {
    minWidth: "50%",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

interface EmployeeFormChoices extends FormChoices {
  gender: FormChoiceField;
  subsector: FormChoiceField;
  department: FormChoiceField;
}

interface IEmployeeFFProps {
  data: Employee;
  choices: EmployeeFormChoices;
  feedback?: any;
  onChange?: (data: Employee) => void;
}

const EmployeeFF: React.FunctionComponent<IEmployeeFFProps> = (props) => {
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
    setFeedback({ ...feedback, [name]: undefined });
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;
    if (
      name === "gender" ||
      name === "reportTo" ||
      name === "department" ||
      name === "subsector"
    ) {
      value = parseInt(value, 10);
      choices[name].init = value;
      value = choices[name].choices[value].value;
    }

    chg(name, value);
  };

  const getFeedback = (name: string) => {
    return feedback[name] ?? "";
  };

  const getDataProp = (name: string) => {
    if (
      name === "gender" ||
      name === "reportTo" ||
      name === "department" ||
      name === "subsector"
    ) {
      return choices[name].init === -1 ? "" : choices[name].init ?? "";
    }
    return state[name];
  };

  const numValueSetter = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;
    let num = parseInt(value, 10);
    value = isNaN(num) ? 0 : num;
    chg(name, value);
  };

  const genActiveProps = (name: string) => ({
    name,
    value: getDataProp(name),
    onChange: handleChange,
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <TextField
            required
            label="SESA ID"
            fullWidth
            autoComplete="id"
            variant="standard"
            {...genActiveProps("sesaId")}
            error={getFeedback("sesaId") !== ""}
            InputLabelProps={{
              shrink: !!state.sesaId,
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <Typography variant="caption" component="h3">
            Upload Profile Picture
          </Typography>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<CloudUploadIcon />}
            component="label"
          >
            <input
              type="file"
              name="profilePic"
              onChange={handleChange}
              hidden
            />
            Upload
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            label="First name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            {...genActiveProps("firstName")}
            error={getFeedback("firstName") !== ""}
            InputLabelProps={{
              shrink: state.firstName !== "",
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            label="Last name"
            fullWidth
            autoComplete="family-name"
            variant="standard"
            {...genActiveProps("lastName")}
            error={getFeedback("lastName") !== ""}
            InputLabelProps={{
              shrink: state.lastName !== "",
            }}
          />
        </Grid>

        <Grid item xs={4}>
          <FormControl
            component="fieldset"
            error={getFeedback("gender") !== ""}
          >
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              className={classes.genderLabels}
              {...genActiveProps("gender")}
            >
              {choices["gender"].choices.map((x, idx) => (
                <FormControlLabel
                  key={idx}
                  value={idx}
                  control={<Radio />}
                  label={x.name}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Birthday"
            type="date"
            {...genActiveProps("birthDate")}
            error={getFeedback("birthDate") !== ""}
            helperText={getFeedback("birthDate")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Hire date"
            type="date"
            {...genActiveProps("hireDate")}
            error={getFeedback("hireDate") !== ""}
            helperText={getFeedback("hireDate")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Department</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              className={classes.department}
              disabled={choices["department"].choices.length === 0}
              {...genActiveProps("department")}
            >
              {choices["department"].choices.map((x, idx) => (
                <MenuItem key={idx} value={idx}>
                  {x.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Home Location</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              className={classes.subsector}
              disabled={choices["subsector"].choices.length === 0}
              {...genActiveProps("subsector")}
            >
              {choices["subsector"].choices.map((x, idx) => (
                <MenuItem key={idx} value={idx}>
                  {x.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Report to</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              className={classes.reportTo}
              disabled={choices["reportTo"].choices.length === 0}
              {...genActiveProps("reportTo")}
            >
              {choices["reportTo"].choices.map((x, idx) => (
                <MenuItem key={idx} value={idx}>
                  {x.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export type { EmployeeFormChoices };
export default EmployeeFF;
