import * as React from "react";

import { Subsector, Skill } from "src/kernel";
import MainList, { Col } from "./MainList";

interface IHeadcountMainListProps {
  lst: { [id: number]: Skill };
  subsectorLst: { [id: number]: Subsector };
}

const HeadcountMainList: React.FC<IHeadcountMainListProps> = (props) => {
  const { lst, subsectorLst } = props;
  const cols: Col[] = [
    {
      title: "Subsector",
      extractor: (p: Skill) =>
        subsectorLst[p.subsector] ? subsectorLst[p.subsector].name : "",
      comparator: (p1: Skill, p2: Skill) => {
        let pp1 = subsectorLst[p1.subsector].name,
          pp2 = subsectorLst[p2.subsector].name;
        return pp1 < pp2 ? 1 : pp1 === pp2 ? 0 : -1;
      },
    },
    {
      title: "Skill",
      extractor: (p: Skill) => p.name,
      comparator: (p1: Skill, p2: Skill) =>
        p1.name < p2.name ? 1 : p1.name === p2.name ? 0 : -1,
    },
    {
      title: "Employee #",
      extractor: (p: Skill) => p.employees.length,
      comparator: (p1: Skill, p2: Skill) =>
        p1.employees.length - p2.employees.length,
    },
    {
      title: "OT 0%",
      extractor: (p: Skill) => Math.floor(p.headcount),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
    {
      title: "OT 10%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 110),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
    {
      title: "OT 15%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 115),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
    {
      title: "OT 20%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 120),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
    {
      title: "OT 25%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 125),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
  ];

  return <MainList lst={Object.values(lst)} cols={cols} />;
};

export default HeadcountMainList;
