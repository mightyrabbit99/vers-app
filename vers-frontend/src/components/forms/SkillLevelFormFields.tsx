import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import { Skill } from "src/kernel";
import { FormChoices, FormChoiceField } from "./types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  content: {
    width: "80%",
  },
  ctrlPanel: {
    display: "flex",
    marginLeft: "auto", // make item on right side
    flexDirection: "row-reverse",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  level: {
    minWidth: "50%",
  },
}));

interface SkillLevelFormChoices extends FormChoices {
  level: FormChoiceField;
}

interface CardProps {
  data: Skill;
  choices: SkillLevelFormChoices;
  feedback?: any;
  onChange?: (val: Skill) => void;
}

const SkillLevelForm: React.FC<CardProps> = (props) => {
  const classes = useStyles();
  const { data, feedback: fb, choices, onChange } = props;
  const [state, setState] = React.useState(data);
  const [feedback, setFeedback] = React.useState(fb ?? {});
  React.useEffect(() => {
    setFeedback(fb ?? {});
  }, [fb]);
  React.useEffect(() => {
    setState(data);
  }, [data]);

  const getDataProp = (name: string) => {
    return choices[name].init === -1 ? "" : choices[name].init ?? "";
  };

  const chg = (name: string, value: any) => {
    data[name] = value;
    setFeedback({ ...feedback, [name]: undefined });
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;

    value = parseInt(value, 10);
    choices[name].init = value;
    value = choices[name].choices[value].value;

    chg(name, value);
  };

  const genActiveProps = (name: string) => ({
    name,
    value: getDataProp(name),
    onChange: handleChange,
  });

  return (
    <div className={classes.content}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Level</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          className={classes.level}
          {...genActiveProps("level")}
        >
          {choices["level"].choices.map((x, idx) => (
            <MenuItem key={idx} value={idx}>
              {x.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export type { SkillLevelFormChoices };
export default SkillLevelForm;
