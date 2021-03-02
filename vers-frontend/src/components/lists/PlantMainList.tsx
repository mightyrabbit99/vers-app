import * as React from "react";

import { Plant } from "src/kernel";
import MainList from "./MainList";

interface IPlantMainListProps {
  lst: Plant[];
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const PlantMainList: React.FC<IPlantMainListProps> = (props) => {
  const { lst, selected, selectedOnChange, onEdit } = props;
  const cols = [
    {
      title: "Name",
      extractor: (p: Plant) => p.name,
    },
  ];

  return (
    <MainList
      lst={lst}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
      onEdit={onEdit}
    />
  );
};

export default PlantMainList;
