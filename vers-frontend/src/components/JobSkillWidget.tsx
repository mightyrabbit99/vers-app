import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { Job, Skill } from "src/kernel";
import JobSkillList from "./lists/JobSkillList";
import SkillSimpleSelForm from "./forms/SkillSimpleSelForm";
import MyDialog from "src/components/commons/Dialog";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
  },
  ctrlButtons: {
    display: "flex",
    flexDirection: "row-reverse",
    marginLeft: "auto",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  title: {
    height: "15%",
  },
  content: {
    height: "85%",
  },
  form: {},
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IJobSkillWidgetProps {
  lst: { [id: number]: Job };
  skillLst: { [id: number]: Skill };
  onSubmit?: (p: Job) => void;
}

const JobSkillWidget: React.FC<IJobSkillWidgetProps> = (props) => {
  const classes = useStyles();
  const { lst, skillLst, onSubmit } = props;
  const [sel, setSel] = React.useState<Job>();
  React.useEffect(() => {
    setSel((sel) => (sel && sel.id in lst ? lst[sel.id] : undefined));
  }, [lst]);

  const [addLstOpen, setAddLstOpen] = React.useState(false);
  const [availSkills, setAvailSkills] = React.useState<Skill[]>([]);
  const [selectedLst, setSelectedLst] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!sel) return;
    let skillIds = sel.skillsRequired.map((x) => x.skill);
    let newAvailSkills = Object.entries(skillLst)
      .filter(([k, v]) => !skillIds.includes(v.id))
      .map((x) => x[1]);
    setAvailSkills(newAvailSkills);
  }, [sel, lst, skillLst]);

  const handleListItemClick = (event: React.ChangeEvent<any>, i: number) => {
    setSel(lst[i]);
    setSelectedLst([]);
  };

  const handleAddOnClick = () => {
    setSelectedLst([]);
    setAddLstOpen(true);
  };
  const handleDeleteOnClick = () => {
    if (!sel) return;
    let newJob = {
      ...sel,
      skillsRequired: sel.skillsRequired.filter(
        (x) => !selectedLst.includes(x.id)
      ),
    };
    setSelectedLst([]);
    onSubmit && onSubmit(newJob);
  };

  const handleAddSkill = (newSkills: Skill[]) => {
    if (!sel) return;
    let newJob = {
      ...sel,
      skillsRequired: [
        ...sel.skillsRequired,
        ...newSkills.map((x) => ({
          id: -1,
          desc: "",
          level: 1,
          job: sel.id,
          skill: x.id,
        })),
      ],
    };
    setAddLstOpen(false);
    setSel(newJob);
    onSubmit && onSubmit(newJob);
  };

  const handleJobSubmit = (j: Job) => {
    setSel(j);
    onSubmit && onSubmit(j);
  };

  const genListItem = (e: Job, idx: number) => (
    <ListItem
      button
      selected={sel && sel.id === e.id}
      onClick={(event) => handleListItemClick(event, e.id)}
      key={idx}
    >
      <ListItemText primary={`${e.title}`} />
    </ListItem>
  );

  return (
    <React.Fragment>
      <div className={classes.header}>
        <Typography
          className={classes.title}
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
        >
          Skills Required
        </Typography>
      </div>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <List component="nav" aria-label="secondary mailbox folder">
            {Object.values(lst).map(genListItem)}
          </List>
        </Grid>
        <Grid item xs={1}>
          <Divider orientation="vertical" flexItem />
        </Grid>
        <Grid item xs={8}>
          <div className={classes.ctrlButtons}>
            <Button
              variant="contained"
              color="primary"
              disabled={!sel || availSkills.length === 0 || !onSubmit}
              onClick={handleAddOnClick}
            >
              Add
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!sel || selectedLst.length === 0 || !onSubmit}
              onClick={handleDeleteOnClick}
            >
              Delete
            </Button>
          </div>
          {sel ? (
            <JobSkillList
              item={sel}
              skillLst={skillLst}
              onSubmit={handleJobSubmit}
              selected={selectedLst}
              selectedOnChange={setSelectedLst}
            />
          ) : null}
        </Grid>
      </Grid>
      <MyDialog open={addLstOpen} onClose={() => setAddLstOpen(false)}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              className={classes.title}
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Add New Skills
            </Typography>
          </div>
          <div className={classes.formContent}>
            <SkillSimpleSelForm lst={availSkills} onSubmit={handleAddSkill} />
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default JobSkillWidget;
