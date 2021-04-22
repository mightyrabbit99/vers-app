import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Subsector, Skill, Employee } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import MainList, { Col } from "./MainList";
import EmpSkillDispList from "./EmployeeSkillDispList";

const useStyles = makeStyles((theme) => ({
  empSkillLst: {
    height: "100%",
  },
}));

interface IHeadcountMainListProps {
  lst: { [id: number]: Skill };
  subsectorLst: { [id: number]: Subsector };
  employeeLst?: { [id: number]: Employee };
}

const HeadcountMainList: React.FC<IHeadcountMainListProps> = (props) => {
  const classes = useStyles();
  const { lst, subsectorLst, employeeLst } = props;

  const [empSkillLstOpen, setEmpSkillLstOpen] = React.useState(false);
  const [emps, setEmps] = React.useState<Employee[]>([]);

  const showSkillEmps = (p: Skill) => {
    setEmps(p.employees.map(x => employeeLst![x.employee]));
    setEmpSkillLstOpen(true);
  }

  const cols: Col[] = [
    {
      title: "Subsector",
      extractor: (p: Skill) =>
        subsectorLst[p.subsector] ? subsectorLst[p.subsector].name : "",
      comparator: (p1: Skill, p2: Skill) => {
        let pp1 = subsectorLst[p1.subsector].name,
          pp2 = subsectorLst[p2.subsector].name;
        return pp1 < pp2 ? 1 : pp1 === pp2 ? 0 : -1;
      },
    },
    {
      title: "Skill",
      extractor: (p: Skill) => p.name,
      comparator: (p1: Skill, p2: Skill) =>
        p1.name < p2.name ? 1 : p1.name === p2.name ? 0 : -1,
    },
    {
      title: "Employee #",
      extractor: (p: Skill) =>
        employeeLst && p.employees.length > 0 ? (
          <p onClick={() => showSkillEmps(p)}>{p.employees.length}</p>
        ) : (
          p.employees.length
        ),
      comparator: (p1: Skill, p2: Skill) =>
        p1.employees.length - p2.employees.length,
    },
    {
      title: "OT 0%",
      extractor: (p: Skill) => Math.floor(p.headcount),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
    {
      title: "OT 10%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 110),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
    {
      title: "OT 15%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 115),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
    {
      title: "OT 20%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 120),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
    {
      title: "OT 25%",
      extractor: (p: Skill) => Math.floor((p.headcount * 100) / 125),
      comparator: (p1: Skill, p2: Skill) => p2.headcount - p1.headcount,
    },
  ];

  return (
    <React.Fragment>
      <MainList lst={Object.values(lst)} cols={cols} />
      <MyDialog
        open={empSkillLstOpen}
        onClose={() => setEmpSkillLstOpen(false)}
        className={classes.empSkillLst}
      >
        <EmpSkillDispList lst={emps} skills={lst} />
      </MyDialog>
    </React.Fragment>
  );
};

export default HeadcountMainList;
