import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import SubsectorListWidget from "../components/SubsectorListWidget";
import { getData, getSync, getSession } from "src/selectors";
import { delData, downloadExcel, saveData } from "src/slices/data";
import { Subsector, ItemType } from "src/kernel";
import { clearFeedback, submitExcel } from "src/slices/sync";
import ExcelProcessor3 from "src/kernel/ExcelProcessor3";

const useStyles = makeStyles((theme) => ({
  list: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    height: "79vh",
    minHeight: 400,
  },
}));

interface ISectorViewProps {}

const SectorView: React.FC<ISectorViewProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { subsectors, newSubsector, sectors } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);

  const canEdit = () => {
    return user?.is_superuser ? true : user?.vers_user.subsector_group === 1;
  };

  const handleSubmit = (data: Subsector) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Subsector[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  };

  let [fbOpen, setFbOpen] = React.useState(false);
  const handleUploadExcel = async (file: File) => {
    try {
      let ans = await ExcelProcessor3.readSubsectorFile(file);
      dispatch(submitExcel({ type: ItemType.Subsector, data: ans }));
    } catch (e) {
      setFbOpen(true);
    }
  };

  const handleFbClose = () => {
    setFbOpen(false);
  };

  const handleExcelDownloadClick = async () => {
    dispatch(downloadExcel({ type: ItemType.Subsector }));
  };

  return (
    <React.Fragment>
      <div className={classes.list}>
        <SubsectorListWidget
          lst={subsectors}
          sectorLst={sectors}
          newSubsector={newSubsector}
          feedback={feedback}
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
          {"Upload failed"}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default SectorView;
