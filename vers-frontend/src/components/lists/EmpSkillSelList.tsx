import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";

import { Employee, EmpSkillData, Skill } from "src/kernel";

const useStyles = makeStyles((themes) => ({
  content: {
    height: "100%",
    width: "100%",
  },
}));

interface IEmpSkillListProps {
  item: Employee;
  skillLst: { [id: number]: Skill };
  selected?: number[];
  onSubmit?: (e: Employee) => void;
  selectedOnChange?: (lst: number[]) => void;
}

const EmpSkillList: React.FunctionComponent<IEmpSkillListProps> = (props) => {
  const classes = useStyles();
  const { item, skillLst, selected = [], onSubmit, selectedOnChange } = props;
  const [empSkills, setEmpSkills] = React.useState<EmpSkillData[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSelectedIds(selected ?? []);
  }, [selected]);
  React.useEffect(() => {
    setEmpSkills(item.skills.map((x) => Object.assign({}, x)));
  }, [item]);

  const handleSelectAll = (e: React.ChangeEvent<any>) => {
    let newSelectedIds: number[];

    if (e.target.checked) {
      newSelectedIds = empSkills.map((s) => s.id);
    } else {
      newSelectedIds = [];
    }
    selectedOnChange
      ? selectedOnChange(newSelectedIds)
      : setSelectedIds(newSelectedIds);
  };

  const handleSelectOne = (e: React.ChangeEvent<any>, id: number) => {
    let newSelectedIds: number[] = [...selectedIds];
    if (newSelectedIds.indexOf(id) === -1) {
      newSelectedIds.push(id);
    } else {
      newSelectedIds.splice(newSelectedIds.indexOf(id), 1);
    }

    selectedOnChange
      ? selectedOnChange(newSelectedIds)
      : setSelectedIds(newSelectedIds);
  };

  const genSkillTableRow = (x: EmpSkillData, idx: number) => {
    const handleChange = (e: React.ChangeEvent<any>) => {
      const { value } = e.target;
      const newSkills = [...item.skills];
      newSkills[idx] = { ...newSkills[idx], level: value };
      setEmpSkills(newSkills);
      const newEmp: Employee = {
        ...item,
        skills: newSkills,
      };
      onSubmit && onSubmit(newEmp);
    };

    if (!skillLst[x.skill]) return null;
    return (
      <TableRow key={idx}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={selectedIds.includes(x.id)}
            onChange={(event: any) => handleSelectOne(event, x.id)}
            value="true"
          />
        </TableCell>
        <TableCell>{skillLst[x.skill].name}</TableCell>
        <TableCell>
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="level"
              value={x.level}
              disabled={!onSubmit}
              onChange={handleChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer className={classes.content}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={selectedIds.length === empSkills.length}
                color="primary"
                indeterminate={
                  selectedIds.length > 0 &&
                  selectedIds.length < empSkills.length
                }
                disabled={empSkills.length === 0}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{empSkills.map(genSkillTableRow)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default EmpSkillList;
