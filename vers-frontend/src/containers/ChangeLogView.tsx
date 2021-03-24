import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeleteIcon from '@material-ui/icons/Delete';

import { Log, MyLog, LogType, DataType } from "src/kernel";
import { getData } from "src/selectors";
import { clearMyLog } from "src/slices/data";

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
  title: {
    height: "15%",
  },
  topBar: {
    display: "flex",
    flexDirection: "row",
  },
  rightItem: {
    marginLeft: "auto",
  },
  content: {
    height: "85%",
    overflowY: "scroll",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  myLogItem: {
    width: "99%",
  },
}));

const myGetIden = (data: any) => {
  return data.name ?? data.title ?? data.on ?? ((data.first_name && data.last_name) ? `${data.first_name}, ${data.last_name}` : "");
}

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
      case DataType.DEPARTMENT:
        return "Department";
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
  return `${genActionStr(log.type)} ${genDataTypeStr(log.dataType)} "${myGetIden(log.desc.original ?? log.desc.data)}"`;
};

const ChangeLogView: React.FC = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { logs, personalLogs } = useSelector(getData);

  const genDetail = (x: any) => {
    let iden = myGetIden(x.data);
    return `${x.success ? "Success" : "Failed"}: ${x.data._type} "${iden}" ${x.statusText}`;
  };

  const genFailDetail = (x: any) => {
    let err_lst = Object.entries(x).filter(x => (x[0] !== "_type") && (x[1] instanceof Array)) as [string, string[]][];
    return err_lst.map(x => x[1].map(y => `${x[0]}: ${y}`)).reduce((prev, curr) => `${prev}\n${curr}`, "");
  }

  const handleDeleteMyLog = () => {
    dispatch(clearMyLog());
  }

  const genMyLogCard = (log: MyLog, idx: number) => {
    return (
      <Accordion key={idx} className={classes.myLogItem}>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>{log.desc}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {log.vals.map((x, idx) => {
              return (
                <ListItem key={idx}>
                  <ListItemText
                    primary={genDetail(x)}
                    secondary={x.success ? undefined : genFailDetail(x)}
                  />
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    );
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
          <div className={classes.topBar}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              My Changes
            </Typography>
            <IconButton className={classes.rightItem} onClick={handleDeleteMyLog}>
              <DeleteIcon />
            </IconButton>
          </div>
          <div className={classes.content}>
            {personalLogs.map(genMyLogCard)}
          </div>
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
