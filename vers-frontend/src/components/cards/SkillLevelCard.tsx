import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

import { EmpSkillData, Skill } from "src/kernel";

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
  empSkill: EmpSkillData;
  skill: Skill;
  onSubmit: (empSkill: EmpSkillData) => void;
  onDelete: () => void;
}

const SkillLevelForm: React.FC<CardProps> = (props) => {
  const classes = useStyles();
  const { empSkill, skill, onSubmit, onDelete } = props;

  const lvlChoices = [1, 2, 3, 4];
  const getLvl = () => {
    return empSkill.level === -1 ? "": empSkill.level;
  }

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value: newLvl } = e.target;
    const newEmpSkill = {...empSkill, level: newLvl};
    onSubmit(newEmpSkill);
  }

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        {`${skill.name}:   `}
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={getLvl()}
            onChange={handleChange}
          >
            {lvlChoices.map((x, idx) => (
              <MenuItem value={x} key={idx}>
                {x}
              </MenuItem>
            ))}
          </Select>
        
      </CardContent>
      <CardActions className={classes.ctrlPanel}>
        <IconButton edge="end" aria-label="delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default SkillLevelForm;
