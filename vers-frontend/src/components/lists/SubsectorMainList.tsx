import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Sector, Subsector } from "src/kernel";
import MainList, { Col } from "./MainList";

interface ISubsectorMainListProps {
  lst: { [id: number]: Subsector };
  sectorLst: { [id: number]: Sector };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const SubsectorMainList: React.FC<ISubsectorMainListProps> = (props) => {
  const { lst, sectorLst, selected, selectedOnChange, onEdit } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Subsector) => p.name,
    },
    {
      title: "Sector",
      extractor: (p: Subsector) => sectorLst[p.sector].name,
    },
    {
      title: "Unit",
      extractor: (p: Subsector) => p.unit ?? "",
    },
    {
      title: "Cycle Time (min/unit)",
      extractor: (p: Subsector) => `${p.cycleTime}`,
    },
    {
      title: "Efficiency (%)",
      extractor: (p: Subsector) => `${p.efficiency}`,
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

export default SubsectorMainList;
