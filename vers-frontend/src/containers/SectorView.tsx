import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import ExcelProcessor3 from "src/kernel/ExcelProcessor3";
import SectorListWidget from "../components/SectorListWidget";
import { getData, getSync, getSession } from "src/selectors";
import { delData, downloadExcel, saveData } from "src/slices/data";
import { ItemType, Sector, Feedback } from "src/kernel";
import { clearFeedback, submitExcel } from "src/slices/sync";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    height: "79vh",
    minHeight: 400,
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

const SectorView: React.FC<ISectorViewProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sectors, newSector, plants } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);
  const canEdit = () => {
    return user?.is_superuser ? true : user?.vers_user && user?.vers_user.sector_group === 1;
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
      let ans = await ExcelProcessor3.readSectorFile(file);
      dispatch(submitExcel({ type: ItemType.Sector, data: ans }));
    } catch (e) {
      setFbOpen(true);
    }
  };

  const handleFbClose = () => {
    setFbOpen(false);
  };

  const handleExcelDownloadClick = async () => {
    dispatch(downloadExcel({ type: ItemType.Sector }));
  };

  return (
    <React.Fragment>
      <div className={classes.list}>
        <SectorListWidget
          lst={sectors}
          plantLst={plants}
          newSector={newSector}
          feedback={feedback as Feedback<Sector>}
          edit={canEdit()}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onReset={handleReset}
          uploadExcel={handleUploadExcel}
          downloadExcel={handleExcelDownloadClick}
        />
      </div>
      <Snackbar open={fbOpen} autoHideDuration={6000} onClose={handleFbClose}>
        <Alert onClose={handleFbClose} severity={"error"}>
          {"Upload failed: Make sure you use the correct format"}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default SectorView;
