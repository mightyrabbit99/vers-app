import * as React from "react";
import { Employee } from "src/kernel";

interface IEmpFileListProps {
  item: Employee;
}

const EmpFileList: React.FunctionComponent<IEmpFileListProps> = (props) => {
  const { item } = props;
  return (
    <div>
      {item.files?.map((x) => (
        <a href={x.file as string}>{x.file}</a>
      ))}
    </div>
  );
};

export default EmpFileList;
