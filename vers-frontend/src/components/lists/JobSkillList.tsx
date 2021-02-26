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

import { Job, JobSkillData, Skill } from "src/kernel";

const useStyles = makeStyles((themes) => ({
  content: {
    height: "100%",
    width: "100%",
  },
}));

interface IJobSkillListProps {
  item: Job;
  skillLst: { [id: number]: Skill };
  selected?: number[];
  onSubmit?: (e: Job) => void;
  selectedOnChange?: (lst: number[]) => void;
}

const JobSkillList: React.FunctionComponent<IJobSkillListProps> = (props) => {
  const classes = useStyles();
  const { item, skillLst, selected = [], onSubmit, selectedOnChange } = props;
  const jobSkills = item.skillsRequired.map((x) => Object.assign({}, x));
  const [selectedIds, setSelectedIds] = React.useState<number[]>(selected);
  React.useEffect(() => {
    setSelectedIds(selected);
  }, [selected]);

  const handleSelectAll = (e: React.ChangeEvent<any>) => {
    let newSelectedIds: number[];

    if (e.target.checked) {
      newSelectedIds = jobSkills.map((s) => s.id);
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

  const genSkillTableRow = (x: JobSkillData, idx: number) => {
    const handleChange = (e: React.ChangeEvent<any>) => {
      const { value } = e.target;
      const newSkills = [...item.skillsRequired];
      newSkills[idx] = { ...newSkills[idx], level: value };
      const newJob: Job = {
        ...item,
        skillsRequired: newSkills,
      };
      onSubmit && onSubmit(newJob);
    };

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
                checked={selectedIds.length === jobSkills.length}
                color="primary"
                indeterminate={
                  selectedIds.length > 0 &&
                  selectedIds.length < jobSkills.length
                }
                disabled={jobSkills.length === 0}
                onChange={handleSelectAll}
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{item.skillsRequired.map(genSkillTableRow)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default JobSkillList;
