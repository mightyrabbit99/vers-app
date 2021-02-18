import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Paper, makeStyles } from "@material-ui/core";

import SubsectorListWidget from "../components/SubsectorListWidget";
import { getData } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { Subsector } from "src/kernel";
import { clearFeedback } from "src/slices/sync";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "70vh",
  },
}));

interface ISectorViewProps {}

const SectorView: React.FunctionComponent<ISectorViewProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { subsectors, newSubsector, sectors } = useSelector(getData);

  const handleSubmit = (data: Subsector) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Subsector[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <SubsectorListWidget
            lst={subsectors}
            sectorLst={sectors}
            newSubsector={newSubsector}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onReset={handleReset}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SectorView;
