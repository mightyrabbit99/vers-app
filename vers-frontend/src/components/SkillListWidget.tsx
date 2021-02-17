import * as React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";

import { Subsector, Skill } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import SkillForm from "src/components/forms/SkillForm";
import SkillList from "src/components/lists/SkillMainList";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
  },
  ctrlButtons: {
    display: "flex",
    flexDirection: "row",
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

interface ISkillListWidgetProps {
  lst: { [id: number]: Skill };
  subsectorLst: { [id: number]: Subsector };
  newSkill?: Skill;
  feedback?: any;
  onSubmit: (p: Skill) => void;
  onDelete: (...ps: Skill[]) => void;
}

const SkillListWidget: React.FunctionComponent<ISkillListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const { lst, subsectorLst, newSkill, feedback, onSubmit, onDelete } = props;

  const [selected, setSelected] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSelected([]);
  }, []);
  const handleDeleteOnClick = () => {
    onDelete(...selected.map((x) => lst[x]));
    setSelected([]);
  };

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(newSkill);
  React.useEffect(() => {
    setFormData(newSkill);
  }, [newSkill]);

  const handleSubmit = (data: Skill) => {
    onSubmit(data);
    setFormOpen(false);
  };
  const handleEditOnClick = (id: number) => {
    setFormData(lst[id]);
    setFormOpen(true);
  };

  const handleCreateOnClick = () => {
    setFormData(newSkill);
    setFormOpen(true);
  }

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
          Skills
        </Typography>
        <div className={classes.ctrlButtons}>
          <Button variant="contained" color="primary" onClick={handleCreateOnClick}>
            Create
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={selected.length === 0}
            onClick={handleDeleteOnClick}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={classes.content}>
        <SkillList
          lst={lst}
          subsectorLst={subsectorLst}
          selected={selected}
          selectedOnChange={setSelected}
          onEdit={handleEditOnClick}
        />
      </div>
      <MyDialog open={formOpen} onClose={() => setFormOpen(false)}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              className={classes.title}
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              {formData && formData.id === -1
                ? "Create New Skill"
                : "Edit Skill"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <SkillForm
                data={formData}
                subsectorLst={subsectorLst}
                feedback={feedback}
                onSubmit={handleSubmit}
                onCancel={() => setFormOpen(false)}
              />
            ) : null}
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default SkillListWidget;
