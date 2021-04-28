import * as React from "react";

import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import { Subsector, Employee } from "src/kernel";
import MainList, { Col } from "./MainList3";

interface IEmployeeMainListProps {
  lst: { [id: number]: Employee };
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
  width?: number;
}

const getName = (p: Employee) => `${p.firstName}, ${p.lastName}`;

const EmployeeMainList: React.FC<IEmployeeMainListProps> = (props) => {
  const { lst, selected, selectedOnChange, onEdit, width } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: Employee) => getName(p),
      comparator: (p1: Employee, p2: Employee) =>
        p1.firstName < p2.firstName ? 1 : p1.firstName === p2.firstName ? 0 : -1,
      style: {
        width: 300,
      },
     },
    {
      title: "Department",
      extractor: (p: Employee) => p.department,
      comparator: (p1: Employee, p2: Employee) =>
        p1.department < p2.department ? 1 : p1.department === p2.department ? 0 : -1,
      style: {
        width: 150,
      },
    },
    {
      title: "Home Location",
      extractor: (p: Employee) => p.subsector,
      comparator: (p1: Employee, p2: Employee) => p1.subsector < p2.subsector ? 1 : p1.subsector === p2.subsector ? 0 : -1,
      style: {
        width: 200,
      },
    },
    {
      title: "Report to",
      extractor: (p: Employee) =>
        p.reportTo !== -1 && lst[p.reportTo] ? getName(lst[p.reportTo]) : "",
      comparator: (p1: Employee, p2: Employee) => {
        if (p1.reportTo === -1 || p2.reportTo === -1) {
          if (p1.reportTo === -1 && p2.reportTo === -1) {
            return 0;
          } else if (p1.reportTo === -1) {
            return 1;
          } else {
            return -1;
          }
        }
        let pp1 = lst[p1.reportTo].name,
          pp2 = lst[p2.reportTo].name;
        return pp1 < pp2 ? 1 : pp1 === pp2 ? 0 : -1;
      },
      style: {
        width: 200,
      },
    },
  ];

  if (onEdit) {
    cols.push({
      extractor: (p: Subsector) => (
        <IconButton onClick={() => onEdit(p.id)}>
          <EditIcon />
        </IconButton>
      ),
      style: {
        width: 50,
      },
    });
  }

  return (
    <MainList
      lst={Object.values(lst)}
      cols={cols}
      selected={selected}
      width={width}
      selectedOnChange={selectedOnChange}
    />
  );
};

export default EmployeeMainList;
