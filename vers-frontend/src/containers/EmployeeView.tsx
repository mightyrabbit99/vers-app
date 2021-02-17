import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Paper, makeStyles } from "@material-ui/core";

import EmployeeListWidget from "src/components/EmployeeListWidget";
import { getData, getSync } from "src/selectors";
import { delData, saveData } from "src/slices/data";
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
  const { employees, subsectors, departments, newEmployee } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const handleSubmit = (data: Employee) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Employee[]) => {
    dispatch(delData(data));
  };

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
            onSubmit={handleSubmit}
            onDelete={handleDelete}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EmployeeView;
