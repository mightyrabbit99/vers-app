import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { Employee, Skill } from "src/kernel";
import EmpSkillList from "./lists/EmpSkillSelList";
import EmployeeSimpleList from "./lists/EmployeeSimpleList";
import SkillSimpleSelForm from "./forms/SkillSimpleSelForm";
import MyDialog from "src/components/commons/Dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  item: {
    height: "100%",
  },
  ctrlButtons: {
    display: "flex",
    flexDirection: "row-reverse",
    marginLeft: "auto",
    height: "15%",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  title: {},
  content: {
    height: "85%",
  },
  list: {
    height: "100%",
    overflowY: "scroll",
  },
  skillLst: {
    height: "85%",
  },
  form: {},
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IEmployeeSkillWidgetProps {
  lst: { [id: number]: Employee };
  skillLst: { [id: number]: Skill };
  onSubmit?: (p: Employee) => void;
}

const EmployeeSkillWidget: React.FC<IEmployeeSkillWidgetProps> = (props) => {
  const classes = useStyles();
  const { lst, skillLst, onSubmit } = props;
  const [sel, setSel] = React.useState<Employee>();
  React.useEffect(() => {
    setSel((sel) => (sel && sel.id in lst ? lst[sel.id] : undefined));
  }, [lst]);

  const [addLstOpen, setAddLstOpen] = React.useState(false);
  const [availSkills, setAvailSkills] = React.useState<Skill[]>([]);
  const [selectedLst, setSelectedLst] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!sel) return;
    let skillIds = sel.skills.map((x) => x.skill);
    let newAvailSkills = Object.entries(skillLst)
      .filter(([k, v]) => !skillIds.includes(v.id))
      .map((x) => x[1]);
    setAvailSkills(newAvailSkills);
  }, [sel, skillLst]);

  const handleListItemClick = (i: number) => {
    setSel(lst[i]);
    setSelectedLst([]);
  };

  const handleAddOnClick = () => {
    setSelectedLst([]);
    setAddLstOpen(true);
  };
  const handleDeleteOnClick = () => {
    if (!sel) return;
    let emp = sel;
    let newEmp = {
      ...emp,
      skills: emp.skills.filter((x) => !selectedLst.includes(x.skill)),
    };
    setSelectedLst([]);
    onSubmit && onSubmit(newEmp);
  };

  const handleAddSkill = (newSkills: Skill[]) => {
    if (!sel) return;
    let emp = sel;
    let newEmp = {
      ...emp,
      skills: [
        ...emp.skills,
        ...newSkills.map((x) => ({
          id: -1,
          desc: "",
          level: 1,
          employee: emp.id,
          skill: x.id,
        })),
      ],
    };
    setAddLstOpen(false);
    onSubmit && onSubmit(newEmp);
  };

  const handleEmpSubmit = (e: Employee) => {
    setSel(e);
    onSubmit && onSubmit(e);
  };

  return (
    <React.Fragment>
      <Grid container spacing={1} className={classes.root}>
        <Grid item xs={4} className={classes.item}>
          <EmployeeSimpleList
            height={380}
            width={300}
            itemSize={46}
            lst={lst}
            sel={sel}
            handleListItemClick={handleListItemClick}
          />
        </Grid>
        <Grid item xs={8} className={classes.item}>
          <div className={classes.ctrlButtons}>
            <Button
              variant="contained"
              color="primary"
              disabled={!sel || availSkills.length === 0 || !onSubmit}
              onClick={handleAddOnClick}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!sel || selectedLst.length === 0 || !onSubmit}
              onClick={handleDeleteOnClick}
            >
              Delete
            </Button>
          </div>
          <div className={classes.skillLst}>
            {sel ? (
              <EmpSkillList
                item={sel}
                skillLst={skillLst}
                onSubmit={handleEmpSubmit}
                selected={selectedLst}
                selectedOnChange={setSelectedLst}
              />
            ) : null}
          </div>
        </Grid>
      </Grid>
      <MyDialog open={addLstOpen} onClose={() => setAddLstOpen(false)}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              className={classes.title}
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Add New Skills
            </Typography>
          </div>
          <div className={classes.formContent}>
            <SkillSimpleSelForm lst={availSkills} onSubmit={handleAddSkill} />
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default EmployeeSkillWidget;
