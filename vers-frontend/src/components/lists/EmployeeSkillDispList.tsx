import * as React from "react";

import Chip from "@material-ui/core/Chip";

import { Employee, Skill } from "src/kernel";
import MainList, { Col } from "./MainList";

interface IEmpSkillDispListProps {
  lst: Employee[];
  skills: { [id: number]: Skill };
}

const getName = (p: Employee) => `${p.firstName}, ${p.lastName}`;

const EmpSkillDispList: React.FC<IEmpSkillDispListProps> = (props) => {
  const { lst, skills } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Employee) => getName(p),
      comparator: (p1: Employee, p2: Employee) =>
        p1.firstName < p2.firstName
          ? 1
          : p1.firstName === p2.firstName
          ? 0
          : -1,
    },
    {
      title: "Skills",
      extractor: (p: Employee) =>
        p.skills.map((x, idx) => (
          <Chip key={idx} label={`${skills[x.skill].name} (${x.level})`} />
        )),
      comparator: (p1: Employee, p2: Employee) => p1.skills.length - p2.skills.length,
    },
  ];
  return <MainList lst={lst} cols={cols} />;
};

export default EmpSkillDispList;
