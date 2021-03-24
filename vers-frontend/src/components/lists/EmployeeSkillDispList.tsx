import * as React from "react";

import Chip from "@material-ui/core/Chip";

import { Employee, Skill } from "src/kernel";
import MainList from "./MainList";

interface IEmpSkillDispListProps {
  lst: Employee[];
  skills: { [id: number]: Skill };
}

const getName = (p: Employee) => `${p.firstName}, ${p.lastName}`;

const EmpSkillDispList: React.FC<IEmpSkillDispListProps> = (
  props
) => {
  const { lst, skills } = props;
  const cols = [
    {
      title: "Name",
      extractor: (p: Employee) => getName(p),
    },
    {
      title: "Skills",
      extractor: (p: Employee) =>
        p.skills.map((x, idx) => (
          <Chip key={idx} label={`${skills[x.skill].name} (${x.level})`} />
        )),
    },
  ];
  return <MainList lst={Object.values(lst)} cols={cols} />;
};

export default EmpSkillDispList;
