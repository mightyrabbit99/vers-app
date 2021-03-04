import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Department } from "src/kernel";
import MainList, { Col } from "./MainList";

interface IDepartmentMainListProps {
  lst: Department[];
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const DepartmentMainList: React.FC<IDepartmentMainListProps> = (props) => {
  const { lst, selected, selectedOnChange, onEdit } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Department) => p.name,
    },
  ];

  if (onEdit) {
    cols.push({
      extractor: (p: Department) => (
        <IconButton onClick={() => onEdit(p.id)}>
          <EditIcon />
        </IconButton>
      ),
    });
  }

  return (
    <MainList
      lst={lst}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
    />
  );
};

export default DepartmentMainList;
