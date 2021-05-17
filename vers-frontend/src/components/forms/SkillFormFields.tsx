import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import { Skill } from "src/kernel";
import { commonFormFieldStyles, FormChoiceField, FormChoices } from "./types";

const useStyles = makeStyles(commonFormFieldStyles);

interface SkillFormChoices extends FormChoices {
  subsector: FormChoiceField;
}

interface ISkillFFProps {
  data: Skill;
  choices: SkillFormChoices;
  feedback?: any;
  onChange?: (data: Skill) => void;
}

const SkillFF: React.FC<ISkillFFProps> = (props) => {
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

  const chg = (name: keyof Skill, value: Skill[keyof Skill]) => {
    data[name] = value as never;
    setFeedback({...feedback, [name]: undefined});
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const getDataProp = (name: keyof Skill) => {
    if (name === "subsector") {
      return choices[name].init === -1 ? "" : choices[name].init;
    }
    return state[name];
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

  const getFeedback = (name: keyof Skill) => {
    return (feedback && name in feedback) ? feedback[name] ?? "" : "";
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

  const genActiveProps = (name: keyof Skill) => ({
    name,
    value: getDataProp(name),
    onChange: handleChange,
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container spacing={3} className={classes.form}>
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            {...genActiveProps("name")}
          />
        </Grid> 
        <Grid item xs={12} sm={5}>
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
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Priority"
            variant="filled"
            {...genActiveProps("priority")}
            onBlur={numValueSetter}
            type="number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="% of Subsector"
            variant="filled"
            {...genActiveProps("percentageOfSubsector")}
            onBlur={numValueSetter}
            type="number"
          />
        </Grid>
      </Grid>
    </form>
  );
};

export type { SkillFormChoices };
export default SkillFF;
