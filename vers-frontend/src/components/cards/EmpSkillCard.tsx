import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

import { Employee, EmpSkillData } from "src/kernel";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  name: {
    width: "25%",
  },
  skillsDisp: {
    width: "75%",
  },
}));

interface IEmpSkillCardProps {
  item: Employee;
}

const getName = (item: Employee) => `${item.firstName}, ${item.lastName}`;

const EmpSkillCard: React.FunctionComponent<IEmpSkillCardProps> = (props) => {
  const classes = useStyles();
  let { item } = props;
  const skillToChip = (x: EmpSkillData) => {
    const label = `${x.skill}(${x.level})`;
    return <Chip label={label} />;
  };
  return (
    <Paper className={classes.root}>
      <Typography className={classes.name}>{getName(item)}</Typography>
      <div className={classes.skillsDisp}>{item.skills.map(skillToChip)}</div>
    </Paper>
  );
};

export default EmpSkillCard;
