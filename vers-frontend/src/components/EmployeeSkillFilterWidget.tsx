import * as React from "react";

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
  const [filteredLst, setFilteredLst] = React.useState<Employee[]>([]);
  React.useEffect(() => {
    setFilteredLst(Object.values(lst));
  }, []);

  const handleFilterEmp = (skillLvlLst: SkillLevel[]) => {
    const skills = skillLvlLst.reduce((prev, curr) => {
      prev[curr.skill.id] = curr.level;
      return prev;
    }, {} as { [skill: number]: number });
    const ans = Object.values(lst).filter((x) =>
      x.skills.every((y) => y.skill in skills && skills[y.skill] >= y.level)
    );
    setFilteredLst(ans);
  };

  return (
    <Grid container>
      <Grid item xs={3}>
        <SkillLevelSelectWidget lst={skills} onSubmit={handleFilterEmp} />
      </Grid>
      <Grid item xs={9}>
        <EmployeeSkillDispList lst={filteredLst} skills={skills} />
      </Grid>
    </Grid>
  );
};

export default EmployeeSkillFilter;
