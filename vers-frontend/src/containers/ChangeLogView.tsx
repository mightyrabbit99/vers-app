import * as React from "react";
import { useSelector } from "react-redux";

import { Theme, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";

import { Log } from "src/kernel";
import { MyLog } from "src/types";
import { getData } from "src/selectors";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
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
        <Typography>My Changes</Typography>
        <div>{personalLogs.map(genMyLogCard)}</div>
      </Grid>
      <Grid item xs={12}>
        <Typography>All Changes</Typography>
        <div>{Object.values(logs).map(genLogCard)}</div>
      </Grid>
    </Grid>
  );
};

export default ChangeLogView;
