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
      comparator: (p1: Sector, p2: Sector) => p1.name < p2.name ? 1 : p1.name === p2.name ? 0 : -1,
    },
    {
      title: "Plant",
      extractor: (p: Sector) => plantLst[p.plant].name,
      comparator: (p1: Sector, p2: Sector) => {
        let pp1 = plantLst[p1.plant].name, pp2 = plantLst[p2.plant].name;
        return pp1 < pp2 ? 1 : pp1 === pp2 ? 0 : -1;
      },
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
