import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import { Sector } from "src/kernel";
import { commonFormFieldStyles, FormChoiceField, FormChoices } from "./types";

const useStyles = makeStyles(commonFormFieldStyles);

interface SectorFormChoices extends FormChoices {
  plant: FormChoiceField;
}

interface ISectorFFProps {
  data: Sector;
  choices: SectorFormChoices;
  feedback?: any;
  onChange?: (data: Sector) => void;
}

const SectorFF: React.FC<ISectorFFProps> = (props) => {
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

    if (name === "plant") {
      value = parseInt(value, 10);
      choices[name].init = value;
      value = choices[name].choices[value].value;
    }

    data[name as keyof Sector] = value as never;
    setFeedback(feedback ? { ...feedback, [name]: undefined } : undefined);
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const getFeedback = (name: keyof Sector) => {
    return (feedback && name in feedback) ? feedback[name] ?? "" : "";
  };

  const getDataIdx = (name: string) => {
    return choices[name].init === -1 ? "" : choices[name].init;
  };

  const genActiveProps = (name: keyof Sector) => ({
    name,
    value: state[name],
    onChange: handleChange,
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container className={classes.form}>
        <Grid item xs={8}>
          <TextField
            label="Name"
            variant="outlined"
            {...genActiveProps("name")}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Plant</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              name="plant"
              error={getFeedback("plant") !== ""}
              defaultValue={1}
              value={getDataIdx("plant")}
              onChange={handleChange}
              disabled={choices["plant"].choices.length < 2}
            >
              {choices["plant"].choices.map((x, idx) => (
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

export type { SectorFormChoices };
export default SectorFF;
