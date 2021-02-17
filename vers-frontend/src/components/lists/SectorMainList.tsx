import * as React from "react";

import { Plant, Sector } from "src/kernel";
import MainList from "../commons/MainList";

interface ISectorMainListProps {
  lst: { [id: number]: Sector };
  plantLst: { [id: number]: Plant };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const SectorMainList: React.FC<ISectorMainListProps> = (props) => {
  const { lst, plantLst, selected, selectedOnChange, onEdit } = props;
  const cols = [
    {
      title: "Name",
      extractor: (p: Sector) => p.name,
    },
    {
      title: "Plant",
      extractor: (p: Sector) => plantLst[p.plant].name,
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

export default SectorMainList;
