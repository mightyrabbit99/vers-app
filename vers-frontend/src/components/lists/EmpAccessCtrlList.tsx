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
import InputLabel from "@material-ui/core/InputLabel";

import { Employee } from "src/kernel";

interface IEmployeeAccessCtrlListProps {
  lst: { [id: number]: Employee };
  onSubmit: (e: Employee) => void;
}
const getName = (p: Employee) => `${p.firstName}, ${p.lastName}`;

const EmployeeAccessCtrlList: React.FC<IEmployeeAccessCtrlListProps> = (
  props
) => {
  const { lst, onSubmit } = props;

  const empLst = Object.values(lst);

  const genTableRow = (emp: Employee, idx: number) => {
    const vers_user = emp.user.vers_user;
    type VersUserIndex = keyof typeof vers_user;
    function isValidName(value: string): value is VersUserIndex {
      return value in vers_user;
    }
    function getVal(name: string) {
      return isValidName(name) ? vers_user[name] : "";
    }

    const genSelector = (label: string, name: string) => {
      const val = getVal(name);
      const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        const newEmp: Employee = {
          ...emp,
          user: {
            ...emp.user,
            vers_user: {
              ...emp.user.vers_user,
              [name]: value,
            },
          },
        };
        onSubmit(newEmp);
      };
      return (
        <FormControl>
          <InputLabel id="demo-simple-select-label">{label}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name={name}
            value={val}
            onChange={handleChange}
          >
            <MenuItem value={1}>Owner</MenuItem>
            <MenuItem value={2}>User</MenuItem>
            <MenuItem value={3}>None</MenuItem>
          </Select>
        </FormControl>
      );
    };

    return (
      <TableRow hover key={idx}>
        <TableCell>{getName(emp)}</TableCell>
        <TableCell>{genSelector("Plant group", "plant_group")}</TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Employee</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{empLst.map(genTableRow)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmployeeAccessCtrlList;
