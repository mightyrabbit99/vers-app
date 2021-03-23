import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import UserAccessCtrlWidget from "src/components/UserAccessControlWidget";
import { getData, getSession } from "src/selectors";
import { saveData } from "src/slices/data";
import { User } from "src/kernel";

interface IAccessCtrlViewProps {}

const AccessCtrlView: React.FunctionComponent<IAccessCtrlViewProps> = () => {
  const dispatch = useDispatch();
  const { users } = useSelector(getData);
  const { user } = useSelector(getSession);

  const handleSubmit = (data: User) => {
    dispatch(saveData(data));
  };

  return (
    <div>
      <UserAccessCtrlWidget
        lst={users}
        onSubmit={handleSubmit}
        editSuper={user?.is_superuser}
      />
    </div>
  );
};

export default AccessCtrlView;
