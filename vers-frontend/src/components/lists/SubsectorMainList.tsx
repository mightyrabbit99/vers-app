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
      comparator: (p1: Subsector, p2: Subsector) => p1.name < p2.name ? 1 : p1.name === p2.name ? 0 : -1,
    },
    {
      title: "Sector",
      extractor: (p: Subsector) => sectorLst[p.sector].name,
      comparator: (p1: Subsector, p2: Subsector) => {
        let pp1 = sectorLst[p1.sector].name, pp2 = sectorLst[p2.sector].name;
        return pp1 < pp2 ? 1 : pp1 === pp2 ? 0 : -1;
      },
    },
    {
      title: "Unit",
      extractor: (p: Subsector) => p.unit ?? "",
    },
    {
      title: "Cycle Time (min/unit)",
      extractor: (p: Subsector) => `${p.cycleTime}`,
      comparator: (p1: Subsector, p2: Subsector) => p2.cycleTime - p1.cycleTime,
    },
    {
      title: "Efficiency (%)",
      extractor: (p: Subsector) => `${p.efficiency}`,
      comparator: (p1: Subsector, p2: Subsector) => p2.efficiency - p1.efficiency,
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
