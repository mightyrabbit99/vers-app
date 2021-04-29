import * as React from "react";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import MainList, { Col } from "./MainList3";
import { Employee, EmpSkillData, Skill } from "src/kernel";

interface IEmpSkillListProps {
  item: Employee;
  skillLst: { [id: number]: Skill };
  selected?: number[];
  width?: number;
  onSubmit?: (e: Employee) => void;
  selectedOnChange?: (lst: number[]) => void;
}

const EmpSkillList: React.FC<IEmpSkillListProps> = (props) => {
  const { item, skillLst, selected, width, onSubmit, selectedOnChange } = props;

  const [empSkills, setEmpSkills] = React.useState(item.skills);
  React.useEffect(() => {
    setEmpSkills(item.skills.filter((x) => skillLst[x.skill]));
  }, [item, skillLst]);

  const handleChange = (e: React.ChangeEvent<any>, p: EmpSkillData) => {
    const { value } = e.target;
    const newSkills = [...item.skills];
    const idx = item.skills.findIndex(
      (val: EmpSkillData) => val.skill === p.skill
    );
    newSkills[idx] = { ...newSkills[idx], level: value };
    const newEmp: Employee = {
      ...item,
      skills: newSkills,
    };
    setEmpSkills(newSkills);
    onSubmit && onSubmit(newEmp);
  };

  const cols: Col[] = [
    {
      title: "Name",
      extractor: (p: EmpSkillData) => skillLst[p.skill].name,
      comparator: (p1: EmpSkillData, p2: EmpSkillData) =>
        skillLst[p1.skill].name < skillLst[p2.skill].name
          ? 1
          : skillLst[p1.skill].name === skillLst[p2.skill].name
          ? 0
          : -1,
      style: {
        width: 430,
      },
    },
    {
      title: "Level",
      extractor: (p: EmpSkillData) => (
        <FormControl>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="level"
            value={p.level}
            disabled={!onSubmit}
            onChange={(e) => handleChange(e, p)}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
          </Select>
        </FormControl>
      ),
      comparator: (p1: EmpSkillData, p2: EmpSkillData) => p1.level - p2.level,
      style: {
        width: 80,
      },
    },
  ];

  return (
    <MainList
      lst={empSkills}
      cols={cols}
      selected={selected}
      width={width}
      selectedOnChange={selectedOnChange}
    />
  );
};

export default EmpSkillList;
