import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import JobListWidget from "src/components/JobListWidget";
import JobSkillWidget from "src/components/JobSkillWidget";
import JobEmpAssignWidget from "src/components/JobEmpAssignWidget";
import { getData, getSync, getSession } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { Job } from "src/kernel";
import { clearFeedback } from "src/slices/sync";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    height: "70vh",
  },
}));

interface IJobViewProps {}

const JobView: React.FunctionComponent<IJobViewProps> = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { jobs, newJob, skills, subsectors, employees } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);

  const canEdit = () => {
    return user?.is_superuser ? true : user?.vers_user.job_group === 1;
  };
  const handleSubmit = (data: Job) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Job[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <JobListWidget
            lst={jobs}
            newJob={newJob}
            feedback={feedback}
            subsectorLst={subsectors}
            edit={canEdit()}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onReset={handleReset}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <JobSkillWidget
            lst={jobs}
            skillLst={skills}
            onSubmit={canEdit() ? handleSubmit : undefined}
          />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <JobEmpAssignWidget
            lst={jobs}
            empLst={employees}
            skillLst={skills}
            onSubmit={canEdit() ? handleSubmit : undefined}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default JobView;
