import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Theme, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { getData } from "src/selectors";
import { clearLog, clearMyLog } from "src/slices/data";
import MyLogListWidget from "src/components/MyLogListWidget";
import LogListWidget from "src/components/LogListWidget";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
  },
  widget: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "70vh",
  },
}));

const ChangeLogView: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { logs, personalLogs } = useSelector(getData);

  const handleDeleteMyLog = () => {
    dispatch(clearMyLog());
  };

  const handleDeleteLog = () => {
    dispatch(clearLog());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.widget}>
          <MyLogListWidget lst={personalLogs} onDelete={handleDeleteMyLog} />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.widget}>
          <LogListWidget lst={Object.values(logs)} onDelete={handleDeleteLog} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChangeLogView;
