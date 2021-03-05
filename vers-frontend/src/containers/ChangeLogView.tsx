import * as React from "react";
import { useSelector } from "react-redux";

import { Theme, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import { Log, MyLog } from "src/kernel";
import { getData } from "src/selectors";

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
  content: {
    height: "85%",
    overflowY: "scroll",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

interface IChangeLogViewProps {}

const ChangeLogView: React.FunctionComponent<IChangeLogViewProps> = (props) => {
  const classes = useStyles();
  const { logs, personalLogs } = useSelector(getData);

  const genMyLogCard = (log: MyLog) => {
    return (
      <Accordion>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>{log.desc}</Typography>
          <AccordionDetails></AccordionDetails>
        </AccordionSummary>
      </Accordion>
    );
  };

  const genLogCard = (log: Log) => {
    return (
      <Accordion>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading}>{log.desc}</Typography>
        </AccordionSummary>
      </Accordion>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.widget}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            My Changes
          </Typography>
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
          <div className={classes.content}>
            {Object.values(logs).map(genLogCard)}
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ChangeLogView;
