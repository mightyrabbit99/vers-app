import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

import { Skill } from "src/kernel";
import { FormChoices } from "./types";



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
}));

interface CardProps {
  item: Skill;
  onDelete: () => void;
  defaultChoice?: number;
  choices?: FormChoices;
  onChange?: (val: number) => void;
}

const SkillLevelForm: React.FC<CardProps> = (props) => {
  const classes = useStyles();
  const { item, onDelete, defaultChoice, choices, onChange } = props;

  const [c, setC] = React.useState(defaultChoice ?? item.id);
  React.useEffect(() => {
    setC(defaultChoice ?? item.id);
  }, [defaultChoice]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value: val } = e.target;
    onChange ? onChange(val) : setC(val);
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {`${item.name}:   `}
        {choices ? (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={c}
            onChange={handleChange}
          >
            {Object.entries(choices).map((x, idx) => (
              <MenuItem value={x[1]} key={idx}>
                {x[0]}
              </MenuItem>
            ))}
          </Select>
        ) : (
          item.level
        )}
      </div>
      <div className={classes.ctrlPanel}>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default SkillLevelForm;
