import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Subsector, Skill } from "src/kernel";
import MainList, { Col } from "./MainList";

interface ISkillMainListProps {
  lst: { [id: number]: Skill };
  subsectorLst: { [id: number]: Subsector };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const SkillMainList: React.FC<ISkillMainListProps> = (props) => {
  const { lst, subsectorLst, selected, selectedOnChange, onEdit } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Skill) => p.name,
      comparator: (p1: Skill, p2: Skill) => p1.name < p2.name ? 1 : p1.name === p2.name ? 0 : -1,
    },
    {
      title: "Subsector",
      extractor: (p: Skill) => subsectorLst[p.subsector].name,
      comparator: (p1: Skill, p2: Skill) => {
        let pp1 = subsectorLst[p1.subsector].name, pp2 = subsectorLst[p2.subsector].name;
        return pp1 < pp2 ? 1 : pp1 === pp2 ? 0 : -1;
      },
    },
    {
      title: "Priority",
      extractor: (p: Skill) => `${p.priority}`,
      comparator: (p1: Skill, p2: Skill) => p2.priority - p1.priority,
    },
    {
      title: "% of Subsector",
      extractor: (p: Skill) => `${p.percentageOfSector}`,
      comparator: (p1: Skill, p2: Skill) => p2.percentageOfSector - p1.percentageOfSector,
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

export default SkillMainList;
