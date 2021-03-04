import * as React from "react";
import _ from "lodash";
import Grid from "@material-ui/core/Grid";

import { Employee, Skill } from "src/kernel";
import SkillLevelSelectWidget, {
  SkillLevel,
} from "src/components/SkillLevelSelectWidget";
import EmployeeSkillDispList from "./lists/EmployeeSkillDispList";

interface IEmployeeSkillFilterProps {
  lst: { [id: number]: Employee };
  skillLst: { [id: number]: Skill };
}

const EmployeeSkillFilter: React.FunctionComponent<IEmployeeSkillFilterProps> = (
  props
) => {
  let { lst, skillLst: skills } = props;
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
  }, [skills]);

  return (
    <Grid container>
      <Grid item xs={3}>
        <SkillLevelSelectWidget lst={skills} onSubmit={setSkillLvlLst} />
      </Grid>
      <Grid item xs={9}>
        <EmployeeSkillDispList lst={filteredLst} skills={skills} />
      </Grid>
    </Grid>
  );
};

export default EmployeeSkillFilter;
