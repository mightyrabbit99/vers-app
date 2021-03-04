import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Plant, Sector } from "src/kernel";
import MainList, { Col } from "./MainList";

interface ISectorMainListProps {
  lst: { [id: number]: Sector };
  plantLst: { [id: number]: Plant };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const SectorMainList: React.FC<ISectorMainListProps> = (props) => {
  const { lst, plantLst, selected, selectedOnChange, onEdit } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Sector) => p.name,
    },
    {
      title: "Plant",
      extractor: (p: Sector) => plantLst[p.plant].name,
    },
  ];

  if (onEdit) {
    cols.push({
      extractor: (p: Sector) => (
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

export default SectorMainList;
