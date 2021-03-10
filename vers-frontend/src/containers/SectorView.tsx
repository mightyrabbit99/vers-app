import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveAs } from "file-saver";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import ExcelProcessor2 from "src/kernel/ExcelProcessor2";
import SectorListWidget from "../components/SectorListWidget";
import { getData, getSync, getSession } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { ItemType, Sector } from "src/kernel";
import { clearFeedback, submitExcel } from "src/slices/sync";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "70vh",
  },
  title: {
    height: "15%",
  },
  form: {},
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
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
    return user?.is_superuser ? true : user?.vers_user.sector_group === 1;
  };

  const handleSubmit = (data: Sector) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Sector[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  };

  let [fbOpen, setFbOpen] = React.useState(false);

  const handleUploadExcel = async (file: File) => {
    try {
      let ans = await ExcelProcessor2.readSectorFile(file);
      dispatch(submitExcel({ type: ItemType.Sector, data: ans }));
    } catch (e) {
      setFbOpen(true);
    }
  };

  const handleFbClose = () => {
    setFbOpen(false);
  };

  const handleExcelDownloadClick = async () => {
    let sectorObjs = Object.values(sectors).map((x, idx) => ({
      ...x,
      line: idx,
      plant: plants[x.plant].name,
    }));
    let s = await ExcelProcessor2.genSectorFile(sectorObjs);
    var blob = new Blob([s], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Sectors.xlsx`);
  };

  return (
    <React.Fragment>
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

export default SectorView;
