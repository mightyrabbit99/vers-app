import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getSession } from "src/selectors";

import Button from "@material-ui/core/Button";

interface IProfileProps {}

const ProfilePage: React.FunctionComponent<IProfileProps> = (props) => {
  const { user } = useSelector(getSession);
  const history = useHistory();

  const handleEditClick = (e: React.ChangeEvent<any>) => {
    history.push('/user_edit');
  }

  return (
    <div>
      <div>Type: {user ? "Employee" : "Guest"}</div>
      {user ? <div>Username: {user.username}</div> : null}
      <Button onClick={handleEditClick}>Edit</Button>
    </div>
  );
};

export default ProfilePage;
