import * as React from "react";

import GetAppIcon from "@material-ui/icons/GetApp";

import { Employee } from "src/kernel";
import { EmpFileData } from "src/kernel/data";
import MainList, { Col } from "./MainList";

interface IEmpFileListProps {
  item: Employee;
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
  onEdit?: (id: number) => void;
  width?: number;
}

const EmpFileList: React.FunctionComponent<IEmpFileListProps> = (props) => {
  const { item, selected, selectedOnChange } = props;
  const cols: Col[] = [
    {
      title: "Name",
      extractor: (f: EmpFileData) => f.name,
    },
    {
      extractor: (f: EmpFileData) => (
        <a href={f.file as string} download>
          <GetAppIcon />
        </a>
      ),
    },
  ];
  return (
    <MainList
      lst={item.files ?? []}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
    />
  );
};

export default EmpFileList;
