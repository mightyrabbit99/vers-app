import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Subsector, Skill } from "src/kernel";
import MainList, { Col } from "./MainList";

interface IHeadCountMainListProps {
  lst: { [id: number]: Skill };
  subsectorLst: { [id: number]: Subsector };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const HeadCountMainList: React.FC<IHeadCountMainListProps> = (props) => {
  const { lst, subsectorLst, selected, selectedOnChange, onEdit } = props;
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
      title: "Overtime 0%",
      extractor: (p: Skill) => p.headcount,
    },
    {
      title: "Overtime 10%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 110),
    },
    {
      title: "Overtime 15%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 115),
    },
    {
      title: "Overtime 20%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 120),
    },
    {
      title: "Overtime 25%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 125),
    },
  ];

  if (onEdit) {
    cols.push({
      extractor: (p: Subsector) => (
        <IconButton onClick={() => onEdit(p.id)}>
          <EditIcon />
        </IconButton>
      ),
    });
  }

  return (
    <MainList
      lst={Object.values(lst)}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
    />
  );
};

export default HeadCountMainList;
