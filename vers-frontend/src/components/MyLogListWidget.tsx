import * as React from "react";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Accordion from "@material-ui/core/Accordion";

import DeleteIcon from "@material-ui/icons/Delete";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { MyLog } from "src/kernel";

const useStyles = makeStyles((theme) => ({
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
  myLogItem: {
    width: "99%",
  },
  myLogItemError: {
    color: "red",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

interface ILogListWidgetProps {
  lst: MyLog[];
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

const genFailDetail = (x: MyLog["vals"][0]) => {
  let err_lst = Object.entries(x).filter(
    (x) => x[0] !== "_type" && x[1] instanceof Array
  ) as [string, string[]][];
  return err_lst
    .map((x) => x[1].map((y) => `${x[0]}: ${y}`))
    .reduce((prev, curr) => `${prev}\n${curr}`, "");
};

const genDetail = (x: MyLog["vals"][0]) => {
  let iden = myGetIden(x.data);
  return `${x.success ? "Success" : "Failed"}: ${x.data._type} "${iden}" ${
    x.statusText
  }`;
};

const LogListWidget: React.FunctionComponent<ILogListWidgetProps> = (props) => {
  const classes = useStyles();
  const { lst, onDelete } = props;

  const genMyLogCard = (log: MyLog, idx: number) => {
    const timestamp = new Date(log.time).toISOString();
    return (
      <Accordion key={idx} className={classes.myLogItem}>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography
            className={clsx(
              classes.heading,
              log.vals.some((x) => !x.success) ? classes.myLogItemError : null
            )}
          >
            {`[${timestamp.substr(0, 10)}, ${timestamp.substr(11, 8)}] ${log.desc}`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {log.vals.map((x, idx) => {
              return (
                <ListItem key={idx}>
                  <ListItemText
                    className={!x.success ? classes.myLogItemError : undefined}
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

  return (
    <React.Fragment>
      <div className={classes.topBar}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          My Changes
        </Typography>
        {onDelete ? (
          <IconButton className={classes.rightItem} onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        ) : null}
      </div>
      <div className={classes.content}>{lst.map(genMyLogCard)}</div>
    </React.Fragment>
  );
};

export default LogListWidget;
