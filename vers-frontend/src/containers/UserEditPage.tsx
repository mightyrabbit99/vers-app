import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import UserEditForm from "src/components/forms/UserEditForm";
import { getSession } from "src/selectors";

import { changeUserDetail, clearFeedback } from "src/slices/session";

interface IUserEditProps {}

const UserEdit: React.FunctionComponent<IUserEditProps> = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user, feedback } = useSelector(getSession);
  React.useEffect(() => {
    return () => {
      dispatch(clearFeedback());
    };
  }, []);
  const handleSubmit = (data: any) => {
    dispatch(
      changeUserDetail({
        username: data.username,
        password: data.password,
      })
    );
  };

  return (
    <>
      <UserEditForm onSubmit={handleSubmit} user={user} feedback={feedback} />
    </>
  );
};

export default UserEdit;
