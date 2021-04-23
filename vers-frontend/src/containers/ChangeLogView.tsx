import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Log, LogType, DataType } from "src/kernel";
import { getData } from "src/selectors";
import { clearMyLog } from "src/slices/data";
import MyLogListWidget from "src/components/MyLogListWidget";

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
  content: {
    height: "85%",
    overflowY: "scroll",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const myGetIden = (data: any) => {
  return (
    data.name ??
    data.title ??
    data.on ??
    (data.first_name && data.last_name
      ? `${data.first_name}, ${data.last_name}`
      : "")
  );
};

const genDescStr = (log: Log) => {
  const genActionStr = (x: LogType) => {
    switch (x) {
      case LogType.CREATE:
        return "Created";
      case LogType.UPDATE:
        return "Updated";
      case LogType.DELETE:
        return "Deleted";
      default:
        return "";
    }
  };
  const genDataTypeStr = (x: DataType) => {
    switch (x) {
      case DataType.EMPLOYEE:
        return "Employee";
      case DataType.PLANT:
        return "Plant";
      case DataType.SECTOR:
        return "Sector";
      case DataType.SUBSECTOR:
        return "Subsector";
      case DataType.JOB:
        return "Job";
      case DataType.FORECAST:
        return "Forecast";
      case DataType.SKILL:
        return "Skill";
      default:
        return "";
    }
  };
  return `${genActionStr(log.type)} ${genDataTypeStr(
    log.dataType
  )} "${myGetIden(log.desc.original ?? log.desc.data)}"`;
};

const ChangeLogView: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { logs, personalLogs } = useSelector(getData);

  const handleDeleteMyLog = () => {
    dispatch(clearMyLog());
  };

  const genLogCard = (log: Log, idx: number) => {
    return (
      <ListItem key={idx}>
        <Typography className={classes.heading}>{genDescStr(log)}</Typography>
      </ListItem>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.widget}>
          <MyLogListWidget lst={personalLogs} onDelete={handleDeleteMyLog}/>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.widget}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            All Changes
          </Typography>
          <List className={classes.content}>
            {Object.values(logs).map(genLogCard)}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChangeLogView;
