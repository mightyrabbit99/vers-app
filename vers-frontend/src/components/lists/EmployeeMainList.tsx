import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Subsector, Employee } from "src/kernel";
import MainList, { Col } from "./MainList";

interface IEmployeeMainListProps {
  lst: { [id: number]: Employee };
  subsectorLst: { [id: number]: Subsector };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const getName = (p: Employee) => `${p.firstName}, ${p.lastName}`;

const EmployeeMainList: React.FC<IEmployeeMainListProps> = (props) => {
  const {
    lst,
    subsectorLst,
    selected,
    selectedOnChange,
    onEdit,
  } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Employee) => getName(p),
    },
    {
      title: "Home Location",
      extractor: (p: Employee) =>
        subsectorLst[p.subsector] ? subsectorLst[p.subsector].name : "",
    },
    {
      title: "Report to",
      extractor: (p: Employee) =>
        p.reportTo !== -1 && lst[p.reportTo] ? getName(lst[p.reportTo]) : "",
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

export default EmployeeMainList;
