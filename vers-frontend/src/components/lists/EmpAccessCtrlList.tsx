import * as React from "react";

import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";

import { AccessLevel, User } from "src/kernel";


interface IUserAccessCtrlListProps {
  lst: { [id: number]: User };
  onSubmit?: (e: User) => void;
  editSuper?: boolean;
}
const getName = (p: User) => p.username;

const UserAccessCtrlList: React.FC<IUserAccessCtrlListProps> = (
  props
) => {
  const { lst, onSubmit, editSuper = false } = props;

  const empLst = Object.values(lst);

  const genTableRow = (user: User, idx: number) => {
    const vers_user = user.vers_user;
    type VersUserIndex = keyof typeof vers_user;
    function isValidName(value: string): value is VersUserIndex {
      return value in vers_user;
    }
    function getVal(name: string) {
      return isValidName(name) ? vers_user[name] : "";
    }

    const genSelector = (name: string) => {
      const val = getVal(name);
      const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        const newEmp: User = {
            ...user.user,
            vers_user: {
              ...user.vers_user,
              [name]: value,
            },
          };
        onSubmit && onSubmit(newEmp);
      };
      return (
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name={name}
            value={val}
            onChange={handleChange}
            disabled={!onSubmit || user.user.is_superuser}
          >
            <MenuItem value={AccessLevel.NONE}>None</MenuItem>
            <MenuItem value={AccessLevel.EDIT}>Edit</MenuItem>
            <MenuItem value={AccessLevel.VIEW}>View</MenuItem>
          </Select>
        </FormControl>
      );
    };

    const handleSuperuserChange = (e: React.ChangeEvent<any>) => {
      const { checked } = e.target;
      const newEmp: User = {
        ...user,
        is_superuser: checked,
        vers_user: {
          ...user.vers_user,
        },
      };
      onSubmit && onSubmit(newEmp);
    };

    return (
      <TableRow hover key={idx}>
        <TableCell>{getName(user)}</TableCell>
        {editSuper ? (
          <TableCell padding="checkbox">
            <Checkbox
              name="is_superuser"
              checked={user.is_superuser}
              onChange={handleSuperuserChange}
            />
          </TableCell>
        ) : null}
        <TableCell>{genSelector("plant_group")}</TableCell>
        <TableCell>{genSelector("sector_group")}</TableCell>
        <TableCell>{genSelector("subsector_group")}</TableCell>
        <TableCell>{genSelector("department_group")}</TableCell>
        <TableCell>{genSelector("User_group")}</TableCell>
        <TableCell>{genSelector("skill_group")}</TableCell>
        <TableCell>{genSelector("job_group")}</TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>User</b>
            </TableCell>
            {editSuper ? (
              <TableCell padding="checkbox">
                <b>Superuser</b>
              </TableCell>
            ) : null}
            <TableCell>
              <b>Plant</b>
            </TableCell>
            <TableCell>
              <b>Sector</b>
            </TableCell>
            <TableCell>
              <b>Subsector</b>
            </TableCell>
            <TableCell>
              <b>Department</b>
            </TableCell>
            <TableCell>
              <b>User</b>
            </TableCell>
            <TableCell>
              <b>Skill</b>
            </TableCell>
            <TableCell>
              <b>Job</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{empLst.map(genTableRow)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserAccessCtrlList;
