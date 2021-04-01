import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import ForecastListWidget from "src/components/ForecastListWidget";
import { getData, getSync } from "src/selectors";
import { delData, saveData, downloadExcel } from "src/slices/data";
import { clearFeedback, submitExcel } from "src/slices/sync";
import { Forecast, ItemType } from "src/kernel";
import ExcelProcessor2 from "src/kernel/ExcelProcessor2";

const useStyles = makeStyles((theme) => ({
  widget: {
    padding: theme.spacing(2),
    display: "flex",
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

  let [fbOpen, setFbOpen] = React.useState(false);
  const handleUploadExcel = async (file: File) => {
    try {
      let ans = await ExcelProcessor2.readEmployeeFile(file);
      dispatch(submitExcel({ type: ItemType.Forecast, data: ans }));
    } catch (e) {
      setFbOpen(true);
    }
  };

  const handleFbClose = () => {
    setFbOpen(false);
  };

  const handleExcelDownloadClick = async () => {
    dispatch(downloadExcel({ type: ItemType.Forecast }));
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.widget}>
            <ForecastListWidget
              title="Forecast"
              lst={forecasts}
              newForecast={newForecast}
              feedback={feedback}
              onSubmit={handleForecastSubmit}
              onDelete={handleForecastDelete}
              onReset={handleReset}
              uploadExcel={handleUploadExcel}
              downloadExcel={handleExcelDownloadClick}
            />
          </Paper>
        </Grid>
      </Grid>
      <Snackbar open={fbOpen} autoHideDuration={6000} onClose={handleFbClose}>
        <Alert onClose={handleFbClose} severity={"error"}>
          {"Upload failed"}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default ForecastView;
