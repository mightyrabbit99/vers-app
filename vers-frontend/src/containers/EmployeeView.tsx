import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Paper, makeStyles } from "@material-ui/core";

import EmployeeListWidget from "src/components/EmployeeListWidget";
import EmployeeAccessCtrlWidget from "src/components/EmployeeAccessControlWidget";
import EmployeeSkillWidget from "src/components/EmployeeSkillWidget";

import { getData, getSession, getSync } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { clearFeedback } from "src/slices/sync";
import { Employee } from "src/kernel";



const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "70vh",
  },
}));

interface IEmployeeViewProps {}

const EmployeeView: React.FunctionComponent<IEmployeeViewProps> = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    employees,
    subsectors,
    departments,
    skills,
    newEmployee,
  } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);

  const canEdit = () => {
    return user?.vers_user.employee_group === 1;
  }
  const handleSubmit = (data: Employee) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Employee[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <EmployeeListWidget
            lst={employees}
            subsectorLst={subsectors}
            departmentLst={departments}
            newEmployee={newEmployee}
            feedback={feedback}
            edit={canEdit()}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onReset={handleReset}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <EmployeeAccessCtrlWidget lst={employees} onSubmit={handleSubmit} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <EmployeeSkillWidget
            lst={employees}
            skillLst={skills}
            onSubmit={handleSubmit}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmployeeView;
