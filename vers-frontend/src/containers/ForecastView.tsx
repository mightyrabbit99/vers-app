import * as React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ForecastListWidget from "src/components/ForecastListWidget";
import { getData } from "src/selectors";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "70vh",
  },
}));

interface IForecastViewProps {}

const ForecastView: React.FunctionComponent<IForecastViewProps> = (props) => {
  const classes = useStyles();
  const { forecasts } = useSelector(getData);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <ForecastListWidget />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForecastView;
