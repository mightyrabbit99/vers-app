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
    },
    {
      title: "Skill",
      extractor: (p: Skill) => p.name,
    },
    {
      title: "OT 0%",
      extractor: (p: Skill) => Math.floor(p.headcount),
    },
    {
      title: "OT 10%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 110),
    },
    {
      title: "OT 15%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 115),
    },
    {
      title: "OT 20%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 120),
    },
    {
      title: "OT 25%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 125),
    },
  ];

  return (
    <MainList
      lst={Object.values(lst)}
      cols={cols}
    />
  );
};

export default HeadcountMainList;
