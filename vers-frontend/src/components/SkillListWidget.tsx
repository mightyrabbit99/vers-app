import * as React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";

import { Skill, Subsector } from "src/kernel";
import SkillMainList from "./lists/SkillMainList";
import MyDialog from "./commons/Dialog";
import SkillForm from "./forms/SkillForm";

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
  form: {
    maxWidth: "60vw",
    width: "fit-content",
    minWidth: 300,
  },
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
    width: "fit-content",
  },
}));

interface ISkillListWidgetProps {
  lst: { [id: number]: Skill };
  subsectorLst: { [id: number]: Subsector };
  newSkill?: Skill;
  feedback?: any;
  edit?: boolean;
  onSubmit: (s: Skill) => void;
  onDelete: (...s: Skill[]) => void;
  onReset: () => void;
}

const SkillListWidget: React.FC<ISkillListWidgetProps> = (props) => {
  const classes = useStyles();
  const {
    lst,
    subsectorLst,
    newSkill,
    feedback,
    edit = true,
    onSubmit,
    onDelete,
    onReset,
  } = props;

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
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: Skill) => {
    onSubmit(data);
    setFormOpen(false);
  };
  const handleEditOnClick = (id: number) => {
    setFormData(lst[id]);
    setFormOpen(true);
  };
  const handleFormClose = () => {
    setFormOpen(false);
    onReset();
  };

  const handleCreateOnClick = () => {
    setFormData(newSkill);
    setFormOpen(true);
  };

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
          <Button
            variant="contained"
            color="primary"
            disabled={!edit}
            onClick={handleCreateOnClick}
          >
            Create
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={selected.length === 0 || !edit}
            onClick={handleDeleteOnClick}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className={classes.content}>
        <SkillMainList
          lst={lst}
          subsectorLst={subsectorLst}
          onEdit={edit ? handleEditOnClick : undefined}
        />
      </div>
      <MyDialog open={formOpen} onClose={handleFormClose}>
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
                onCancel={handleFormClose}
              />
            ) : null}
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default SkillListWidget;
