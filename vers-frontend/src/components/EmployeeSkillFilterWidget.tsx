import * as React from "react";

import { Employee, Skill } from "src/kernel";
import EmpSkillCard from "./cards/EmpSkillCard";
import SkillLevelSearchBar, {
  SkillLevel,
} from "src/components/commons/SkillLevelSearchBar";

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
      prev[curr.skill] = curr.level;
      return prev;
    }, {} as { [skill: number]: number });
    const ans = Object.values(lst).filter((x) =>
      x.skills.every((y) => y.skill in skills && skills[y.skill] >= y.level)
    );
    setFilteredLst(ans);
  };

  return (
    <React.Fragment>
      <SkillLevelSearchBar lst={skills} onSubmit={handleFilterEmp} />
      <div>
        {filteredLst.map((x, idx) => (
          <EmpSkillCard item={x} key={idx} />
        ))}
      </div>
    </React.Fragment>
  );
};

export default EmployeeSkillFilter;
