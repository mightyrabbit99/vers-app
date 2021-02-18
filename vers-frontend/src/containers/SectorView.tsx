import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Paper, makeStyles } from "@material-ui/core";

import SectorListWidget from "../components/SectorListWidget";
import { getData, getSync, getSession } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { Sector } from "src/kernel";
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
  const { sectors, newSector, plants } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);

  const canEdit = () => {
    return user?.vers_user.sector_group === 1;
  }
  const handleSubmit = (data: Sector) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Sector[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <SectorListWidget
            lst={sectors}
            plantLst={plants}
            newSector={newSector}
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

export default SectorView;
