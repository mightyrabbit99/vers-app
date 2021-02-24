import * as React from "react";
import {
  makeStyles,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { Sector } from "src/kernel";
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

interface SectorFormChoices extends FormChoices {
  plant: FormChoiceField;
}

interface ISectorFFProps {
  data: Sector;
  choices: SectorFormChoices;
  feedback?: any;
  onChange?: (data: Sector) => void;
}

const SectorFF: React.FunctionComponent<ISectorFFProps> = (props) => {
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

    data[name] = value;
    setFeedback({...feedback, [name]: undefined});
    onChange ? onChange(data) : setState({...state, [name]: value});
  };

  const getFeedback = (name: string) => {
    return feedback[name] ?? "";
  };

  const getDataIdx = (name: string) => {
    return choices[name].init === -1 ? "" : choices[name].init;
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
    </form>
  );
};

export type { SectorFormChoices };
export default SectorFF;
