import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getSession } from "src/selectors";

import Button from "@material-ui/core/Button";
import Path from "src/kernel/Path";

interface IProfileProps {}

const ProfilePage: React.FC<IProfileProps> = (props) => {
  const { user } = useSelector(getSession);
  const history = useHistory();

  const handleEditClick = (e: React.ChangeEvent<any>) => {
    history.push(Path.USER_EDIT_PATH);
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
