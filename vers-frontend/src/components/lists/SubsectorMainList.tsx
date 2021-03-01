import * as React from "react";

import { Sector, Subsector } from "src/kernel";
import MainList from "../commons/MainList";

interface ISubsectorMainListProps {
  lst: { [id: number]: Subsector };
  sectorLst: { [id: number]: Sector };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const SubsectorMainList: React.FC<ISubsectorMainListProps> = (props) => {
  const { lst, sectorLst, selected, selectedOnChange, onEdit } = props;
  const cols = [
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
      title: "Cycle Time",
      extractor: (p: Subsector) => `${p.cycleTime}`,
    },
    {
      title: "Efficiency",
      extractor: (p: Subsector) => `${p.efficiency}`,
    },
  ];

  return (
    <MainList
      lst={Object.values(lst)}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
      onEdit={onEdit}
    />
  );
};

export default SubsectorMainList;
