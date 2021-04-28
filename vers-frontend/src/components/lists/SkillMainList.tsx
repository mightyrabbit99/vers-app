import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Subsector, Skill, Sector } from "src/kernel";
import MainList, { Col } from "./MainList3";

interface ISkillMainListProps {
  lst: { [id: number]: Skill };
  subsectorLst: { [id: number]: Subsector };
  sectorLst: { [id: number]: Sector };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
  width?: number;
}

const W_name = 350;
const W_subsector = 130;
const W_sector = 120;
const W_priority = 120;
const W_percentage = 120;
const W_edit = 50;

const SkillMainList: React.FC<ISkillMainListProps> = (props) => {
  const {
    lst,
    subsectorLst,
    sectorLst,
    selected,
    selectedOnChange,
    onEdit,
    width,
  } = props;

  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Skill) => p.name,
      comparator: (p1: Skill, p2: Skill) =>
        p1.name < p2.name ? 1 : p1.name === p2.name ? 0 : -1,
      style: {
        width: W_name,
      },
    },
    {
      title: "Subsector",
      extractor: (p: Skill) => subsectorLst[p.subsector].name,
      comparator: (p1: Skill, p2: Skill) => {
        let pp1 = subsectorLst[p1.subsector].name,
          pp2 = subsectorLst[p2.subsector].name;
        return pp1 < pp2 ? 1 : pp1 === pp2 ? 0 : -1;
      },
      style: {
        width: W_subsector,
      },
    },
    {
      title: "Sector",
      extractor: (p: Skill) => sectorLst[subsectorLst[p.subsector].sector].name,
      comparator: (p1: Skill, p2: Skill) => {
        let pp1 = sectorLst[subsectorLst[p1.subsector].sector].name,
          pp2 = sectorLst[subsectorLst[p2.subsector].sector].name;
        return pp1 < pp2 ? 1 : pp1 === pp2 ? 0 : -1;
      },
      style: {
        width: W_sector,
      },
    },
    {
      title: "Priority",
      extractor: (p: Skill) => `${p.priority}`,
      comparator: (p1: Skill, p2: Skill) => p2.priority - p1.priority,
      style: {
        width: W_priority,
      },
    },
    {
      title: "% of Subsector",
      extractor: (p: Skill) => `${p.percentageOfSubsector}`,
      comparator: (p1: Skill, p2: Skill) =>
        p2.percentageOfSubsector - p1.percentageOfSubsector,
      style: {
        width: W_percentage,
      },
    },
  ];

  if (onEdit) {
    cols.push({
      extractor: (p: Subsector) => (
        <IconButton onClick={() => onEdit(p.id)}>
          <EditIcon />
        </IconButton>
      ),
      style: {
        width: W_edit,
      },
    });
  }

  return (
    <MainList
      lst={Object.values(lst)}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
      width={width}
    />
  );
};

export default SkillMainList;
