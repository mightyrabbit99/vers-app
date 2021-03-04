import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Job } from "src/kernel";
import MainList, { Col } from "./MainList";

interface IJobMainListProps {
  lst: { [id: number]: Job };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const JobMainList: React.FC<IJobMainListProps> = (props) => {
  const {
    lst,
    selected,
    selectedOnChange,
    onEdit,
  } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Job) => p.title,
    },
  ];

  if (onEdit) {
    cols.push({
      extractor: (p: Job) => (
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

export default JobMainList;
