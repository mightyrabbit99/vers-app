import * as React from "react";

import { Subsector, Employee, Department } from "src/kernel";
import MainList from "../commons/MainList";

interface IEmployeeMainListProps {
  lst: { [id: number]: Employee };
  subsectorLst: { [id: number]: Subsector };
  departmentLst: { [id: number]: Department };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
}

const getName = (p: Employee) => `${p.firstName}, ${p.lastName}`;

const EmployeeMainList: React.FC<IEmployeeMainListProps> = (props) => {
  const {
    lst,
    subsectorLst,
    departmentLst,
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
      title: "Subsector",
      extractor: (p: Employee) =>
        subsectorLst[p.subsector] ? subsectorLst[p.subsector].name : "",
    },
    {
      title: "Department",
      extractor: (p: Employee) =>
        departmentLst[p.department] ? departmentLst[p.department].name : "",
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
