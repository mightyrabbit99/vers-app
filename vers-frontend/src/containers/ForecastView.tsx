import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ForecastListWidget from "src/components/ForecastListWidget";
import { getData } from "src/selectors";
import { saveData } from "src/slices/data";
import { Forecast } from "src/kernel";

const useStyles = makeStyles((theme) => ({
  widget: {
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
  const dispatch = useDispatch();
  const { forecasts } = useSelector(getData);

  const handleForecastSubmit = (f: Forecast) => {
    dispatch(saveData(f));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.widget}>
          <ForecastListWidget lst={forecasts} onSubmit={handleForecastSubmit} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForecastView;
