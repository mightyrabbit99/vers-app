import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import SkillListWidget from "../components/SkillListWidget";
import { getData, getSync, getSession } from "src/selectors";
import { delData, downloadExcel, saveData } from "src/slices/data";
import { Skill, ItemType, Feedback } from "src/kernel";
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

interface ISkillViewProps {}

const SkillView: React.FC<ISkillViewProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { skills, newSkill, subsectors, sectors } = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);

  const canEdit = () => {
    return user?.is_superuser ? true : user?.vers_user && user?.vers_user.skill_group === 1;
  };

  const handleSubmit = (data: Skill) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Skill[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  };

  let [fbOpen, setFbOpen] = React.useState(false);
  const handleUploadExcel = async (file: File) => {
    try {
      let ans = await ExcelProcessor3.readSkillFile(file);
      dispatch(submitExcel({ type: ItemType.Skill, data: ans }));
    } catch (e) {
      setFbOpen(true);
    }
  };

  const handleFbClose = () => {
    setFbOpen(false);
  };

  const handleExcelDownloadClick = async () => {
    dispatch(downloadExcel({ type: ItemType.Skill }));
  };

  return (
    <React.Fragment>
      <div className={classes.list}>
        <SkillListWidget
          lst={skills}
          subsectorLst={subsectors}
          sectorLst={sectors}
          newSkill={newSkill}
          edit={canEdit()}
          feedback={feedback as Feedback<Skill>}
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

export default SkillView;
