import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ForecastListWidget from "src/components/ForecastListWidget";
import { getData, getSync } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { clearFeedback } from "src/slices/sync";
import { Forecast } from "src/kernel";

const useStyles = makeStyles((theme) => ({
  widget: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    height: "70vh",
  },
}));

interface IForecastViewProps {}

const ForecastView: React.FC<IForecastViewProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { forecasts, newForecast } = useSelector(getData);
  const { feedback } = useSelector(getSync);

  const handleForecastSubmit = (f: Forecast) => {
    dispatch(saveData(f));
  };

  const handleForecastDelete = (...f: Forecast[]) => {
    dispatch(delData(f));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.widget}>
          <ForecastListWidget
            lst={forecasts}
            newForecast={newForecast}
            feedback={feedback}
            onSubmit={handleForecastSubmit}
            onDelete={handleForecastDelete}
            onReset={handleReset}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ForecastView;
