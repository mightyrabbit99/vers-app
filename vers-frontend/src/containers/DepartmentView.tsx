import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Paper, makeStyles } from "@material-ui/core";

import DepartmentListWidget from "src/components/DepartmentListWidget";
import { getData } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { Department } from "src/kernel";
import { clearFeedback } from "src/slices/sync";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "70vh",
  },
}));

interface IDepartmentViewProps {}

const DepartmentView: React.FunctionComponent<IDepartmentViewProps> = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { departments, newDepartment } = useSelector(getData);

  const handleSubmit = (data: Department) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Department[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <DepartmentListWidget
            lst={departments}
            newDepartment={newDepartment}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onReset={handleReset}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DepartmentView;
