import * as React from "react";

import { Department } from "src/kernel";
import MainList from "../commons/MainList";

interface IDepartmentMainListProps {
  lst: Department[];
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const DepartmentMainList: React.FC<IDepartmentMainListProps> = (props) => {
  const { lst, selected, selectedOnChange, onEdit } = props;
  const cols = [
    {
      title: "Name",
      extractor: (p: Department) => p.name,
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

export default DepartmentMainList;
