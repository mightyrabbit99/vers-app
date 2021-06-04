import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";

import EmployeeListWidget from "src/components/EmployeeListWidget";
import EmployeeSkillWidget from "src/components/EmployeeSkillWidget";
import EmployeeFileWidget from "src/components/EmployeeFileWidget";

import { getData, getSession, getSync } from "src/selectors";
import { delData, downloadExcel, saveData } from "src/slices/data";
import { clearFeedback, submitExcel } from "src/slices/sync";
import { Employee, ItemType, EmpFile, Feedback } from "src/kernel";
import ExcelProcessor3 from "src/kernel/ExcelProcessor3";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    height: "75vh",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
  },
  content: {
    height: "90%",
  },
  title: {
    height: "15%",
  },
}));

interface IEmployeeViewProps {}

const EmployeeView: React.FC<IEmployeeViewProps> = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { employees, skills, newEmployee } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);

  const canEdit = () => {
    return user?.is_superuser || user?.vers_user.employee_group === 1;
  };
  const handleSubmit = (data: Employee) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Employee[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    feedback && dispatch(clearFeedback());
  };

  let [fbOpen, setFbOpen] = React.useState(false);
  const handleUploadExcel = async (file: File) => {
    try {
      let ans = await ExcelProcessor3.readEmployeeFile(file);
      dispatch(submitExcel({ type: ItemType.Employee, data: ans }));
    } catch (e) {
      setFbOpen(true);
    }
  };

  const handleFbClose = () => {
    setFbOpen(false);
  };

  const handleExcelDownloadClick = async () => {
    dispatch(downloadExcel({ type: ItemType.Employee }));
  };

  const handleFileSubmit = (p: EmpFile) => {
    dispatch(saveData(p));
  };

  const handleFileDelete = (...files: EmpFile[]) => {
    dispatch(delData(files));
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.list}>
            <EmployeeListWidget
              lst={employees}
              newEmployee={newEmployee}
              feedback={feedback as Feedback<Employee>}
              edit={canEdit()}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              onReset={handleReset}
              uploadExcel={handleUploadExcel}
              downloadExcel={handleExcelDownloadClick}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.list}>
            <div className={classes.header}>
              <Typography
                className={classes.title}
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Skills Assignment
              </Typography>
            </div>
            <div className={classes.content}>
              <EmployeeSkillWidget
                lst={employees}
                skillLst={skills}
                onSubmit={canEdit() ? handleSubmit : undefined}
              />
            </div>
          </Paper>
        </Grid>
        {/*<Grid item xs={12}>
          <Paper className={classes.list}>
            <div className={classes.header}>
              <Typography
                className={classes.title}
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Files
              </Typography>
            </div>
            <div className={classes.content}>
              <EmployeeFileWidget
                lst={employees}
                feedback={feedback as Feedback<EmpFile>}
                onSubmit={handleFileSubmit}
                onDelete={handleFileDelete}
              />
            </div>
          </Paper>
  </Grid>*/}
      </Grid>
      <Snackbar open={fbOpen} autoHideDuration={6000} onClose={handleFbClose}>
        <Alert onClose={handleFbClose} severity={"error"}>
          {"Upload failed"}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default EmployeeView;
