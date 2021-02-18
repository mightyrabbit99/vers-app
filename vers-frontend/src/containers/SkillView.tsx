import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Paper, makeStyles } from "@material-ui/core";

import SkillListWidget from "../components/SkillListWidget";
import { getData, getSync, getSession } from "src/selectors";
import { delData, saveData } from "src/slices/data";
import { Skill } from "src/kernel";
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

interface ISkillViewProps {}

const SkillView: React.FunctionComponent<ISkillViewProps> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { skills, newSkill, subsectors} = useSelector(getData);
  const { feedback } = useSelector(getSync);
  const { user } = useSelector(getSession);

  const canEdit = () => {
    return user?.is_superuser ? true : user?.vers_user.skill_group === 1;
  }
  
  const handleSubmit = (data: Skill) => {
    dispatch(saveData(data));
  };
  const handleDelete = (...data: Skill[]) => {
    dispatch(delData(data));
  };
  const handleReset = () => {
    dispatch(clearFeedback());
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.list}>
          <SkillListWidget
            lst={skills}
            subsectorLst={subsectors}
            newSkill={newSkill}
            edit={canEdit()}
            feedback={feedback}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onReset={handleReset}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SkillView;
