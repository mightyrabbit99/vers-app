import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Employee } from "src/kernel";
import { commonFormFieldStyles, FormChoiceField, FormChoices } from "./types";

const useStyles = makeStyles((theme) => ({
  ...commonFormFieldStyles(theme),
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

const EmployeeFF: React.FC<IEmployeeFFProps> = (props) => {
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

  const genActiveProps = (name: string) => ({
    name,
    value: getDataProp(name),
    onChange: handleChange,
  });

  const genProps = (name: string) => ({
    ...genActiveProps(name),
    helperText: getFeedback(name),
    error: getFeedback(name) !== "",
    InputLabelProps: {
      shrink: getDataProp(name) !== "",
    },
  });

  return (
    <form noValidate autoComplete="off" className={classes.root}>
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12} sm={7}>
          <TextField
            required
            label="SESA ID"
            fullWidth
            autoComplete="id"
            variant="standard"
            {...genProps("sesaId")}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
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
            fullWidth
            label="First name"
            autoComplete="given-name"
            variant="standard"
            {...genProps("firstName")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            fullWidth
            label="Last name"
            autoComplete="family-name"
            variant="standard"
            {...genProps("lastName")}
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
            {...genProps("birthDate")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Hire date"
            type="date"
            {...genProps("hireDate")}
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
              fullWidth
              className={classes.department}
              disabled={choices["department"].choices.length === 0}
              {...genActiveProps("department")}
              error={getFeedback("department") !== ""}
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
              fullWidth
              className={classes.subsector}
              disabled={choices["subsector"].choices.length === 0}
              {...genActiveProps("subsector")}
              error={getFeedback("subsector") !== ""}
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
              fullWidth
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
