import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";


import { Employee, Skill } from "src/kernel";
import SkillLevelSelectWidget, {
  SkillLevel,
} from "src/components/SkillLevelSelectWidget";
import EmployeeSkillDispList from "./lists/EmployeeSkillDispList";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  item: {
    height: "100%",
  },
}));

interface IEmployeeSkillFilterProps {
  lst: { [id: number]: Employee };
  skillLst: { [id: number]: Skill };
}

const EmployeeSkillFilter: React.FC<IEmployeeSkillFilterProps> = (
  props
) => {
  const classes = useStyles();
  let { lst, skillLst } = props;
  const [skillLvlLst, setSkillLvlLst] = React.useState<SkillLevel[]>([]);
  const [filteredLst, setFilteredLst] = React.useState<Employee[]>([]);

  React.useEffect(() => {
    const ans = Object.values(lst).filter((x) => {
      let skillMap = x.skills.reduce((prev, curr) => {
        prev[curr.skill] = curr.level;
        return prev;
      }, {} as { [skill: number]: number });
      return skillLvlLst.every(
        (x) => x.skill.id in skillMap && x.level <= skillMap[x.skill.id]
      );
    });
    setFilteredLst(ans);
  }, [skillLvlLst, lst]);

  React.useEffect(() => {
    setSkillLvlLst([]);
  }, []);

  const [skills, setSkills] = React.useState<{ [id: number]: Skill }>();
  React.useEffect(() => {
    setSkills((skills) => skills ?? skillLst);
  }, [skillLst]);

  return (
    <Grid container spacing={1} className={classes.root}>
      <Grid item xs={3} className={classes.item}>
        <SkillLevelSelectWidget lst={skills ?? {}} onSubmit={setSkillLvlLst} />
      </Grid>
      <Grid item xs={9} className={classes.item}>
        <EmployeeSkillDispList lst={filteredLst} skills={skillLst} />
      </Grid>
    </Grid>
  );
};

export default EmployeeSkillFilter;
