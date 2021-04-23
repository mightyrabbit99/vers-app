import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";

import { Log, LogType, DataType } from "src/kernel";


const useStyles = makeStyles((theme) => ({
  content: {
    height: "85%",
    overflowY: "scroll",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

interface ILogListWidgetProps {
  lst: Log[];
  onDelete?: () => void;
}

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

const LogListWidget: React.FunctionComponent<ILogListWidgetProps> = (props) => {
  const classes = useStyles();
  const { lst } = props;

  const genLogCard = (log: Log, idx: number) => {
    return (
      <ListItem key={idx}>
        <Typography className={classes.heading}>{genDescStr(log)}</Typography>
      </ListItem>
    );
  };

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        All Changes
      </Typography>
      <List className={classes.content}>
        {Object.values(lst).map(genLogCard)}
      </List>
    </React.Fragment>
  );
};

export default LogListWidget;
