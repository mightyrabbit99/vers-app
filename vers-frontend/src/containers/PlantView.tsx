import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Paper, makeStyles } from "@material-ui/core";

import PlantListWidget from "src/components/PlantListWidget";
import { getData, getSession, getSync } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { Plant } from "src/kernel";
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

interface IPlantViewProps {}

const PlantView: React.FunctionComponent<IPlantViewProps> = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { plants, newPlant } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);
  const canEdit = () => {
    return user?.vers_user.plant_group === 1;
  }

  const handleSubmit = (data: Plant) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Plant[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <PlantListWidget
            lst={plants}
            newPlant={newPlant}
            feedback={feedback}
            edit={canEdit()}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onReset={handleReset}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PlantView;
