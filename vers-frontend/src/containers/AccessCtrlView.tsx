import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import EmployeeAccessCtrlWidget from "src/components/EmployeeAccessControlWidget";
import { getData, getSession } from "src/selectors";
import { saveData } from "src/slices/data";
import { Employee } from "src/kernel";

interface IAccessCtrlViewProps {}

const AccessCtrlView: React.FunctionComponent<IAccessCtrlViewProps> = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector(getData);
  const { user } = useSelector(getSession);

  const handleSubmit = (data: Employee) => {
    dispatch(saveData(data));
  };

  const employeeExcludeSelf = Object.fromEntries(
    Object.entries(employees).filter(
      (x) => x[1].user.username !== user?.username
    )
  );

  return (
    <div>
      <EmployeeAccessCtrlWidget
        lst={employeeExcludeSelf}
        onSubmit={handleSubmit}
        editSuper={user?.is_superuser}
      />
    </div>
  );
};

export default AccessCtrlView;
