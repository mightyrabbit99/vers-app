import * as React from "react";

import MainList, { Col } from "./MainList3";
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
type VersUserK = keyof User["vers_user"];

const UserAccessCtrlList: React.FC<IUserAccessCtrlListProps> = (props) => {
  const { lst, onSubmit, editSuper = false } = props;

  const genSelector = (user: User, name: VersUserK) => {
    const vers_user = user.vers_user ?? {};
    const val = name in vers_user ? vers_user[name] : "";
    const handleChange = (e: React.ChangeEvent<any>) => {
      const { name, value } = e.target;
      const newEmp: User = {
        ...user,
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
          disabled={!onSubmit || user.is_superuser}
        >
          <MenuItem value={AccessLevel.NONE}>None</MenuItem>
          <MenuItem value={AccessLevel.EDIT}>Edit</MenuItem>
          <MenuItem value={AccessLevel.VIEW}>View</MenuItem>
        </Select>
      </FormControl>
    );
  };

  const cols: Col[] = [
    {
      title: "Username",
      extractor: (p: User) => p.username,
      comparator: (p1: User, p2: User) =>
        p1.username < p2.username ? 1 : p1.username === p2.username ? 0 : -1,
      style: {
        width: 50,
      },
    },
    {
      title: "Plant",
      extractor: (p: User) => genSelector(p, "plant_group"),
      style: {
        width: 50,
      },
    },
    {
      title: "Sector",
      extractor: (p: User) => genSelector(p, "sector_group"),
      style: {
        width: 50,
      },
    },
    {
      title: "Subsector",
      extractor: (p: User) => genSelector(p, "subsector_group"),
      style: {
        width: 50,
      },
    },
    {
      title: "Employee",
      extractor: (p: User) => genSelector(p, "employee_group"),
      style: {
        width: 50,
      },
    },
    {
      title: "Forecast",
      extractor: (p: User) => genSelector(p, "forecast_group"),
      style: {
        width: 50,
      },
    },
  ];

  if (editSuper) {
    cols.splice(1, 0, {
      title: "Super",
      extractor: (p: User) => {
        const handleSuperuserChange = (e: React.ChangeEvent<any>) => {
          const { checked } = e.target;
          const newEmp: User = {
            ...p,
            is_superuser: checked,
            vers_user: {
              ...p.vers_user,
            },
          };
          onSubmit && onSubmit(newEmp);
        };

        return (
          <Checkbox
            name="is_superuser"
            checked={p.is_superuser}
            onChange={handleSuperuserChange}
          />
        );
      },
      style: {
        width: 50,
      },
    });
  }

  return (
    <MainList
      lst={Object.values(lst)}
      cols={cols}
    />
  );
};

export default UserAccessCtrlList;
