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
    },
    {
      title: "Subsector",
      extractor: (p: Skill) => subsectorLst[p.subsector].name,
    },
    {
      title: "Priority",
      extractor: (p: Skill) => `${p.priority}`,
    },
    {
      title: "% of Sector",
      extractor: (p: Skill) => `${p.percentageOfSector}`,
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
