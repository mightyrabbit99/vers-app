import * as React from "react";

import { Subsector, Employee } from "src/kernel";
import MainList from "./MainList";

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
  const cols = [
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

export default EmployeeMainList;
