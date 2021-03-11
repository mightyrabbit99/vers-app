import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Skill, Subsector } from "src/kernel";
import SkillMainList from "./lists/SkillMainList";
import MyDialog from "./commons/Dialog";
import SkillForm from "./forms/SkillForm";
import ListWidget from "./ListWidget";

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
  uploadExcel?: (file: File) => void;
  downloadExcel?: () => void;
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
    uploadExcel,
    downloadExcel,
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
  const [formData, setFormData] = React.useState<Skill>();
  React.useEffect(() => {
    setFormData(formData => formData ?? newSkill);
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
    <ListWidget
      title="Skills"
      disableCreate={!edit}
      disableDelete={selected.length === 0 || !edit}
      createOnClick={handleCreateOnClick}
      deleteOnClick={handleDeleteOnClick}
      downloadExcel={downloadExcel}
      uploadExcel={uploadExcel}
      excelTemplateUrl={process.env.REACT_APP_EXCEL_SKILL_TEMPLATE_URL}
    >
      <SkillMainList
        lst={lst}
        subsectorLst={subsectorLst}
        selected={selected}
        selectedOnChange={setSelected}
        onEdit={edit ? handleEditOnClick : undefined}
      />
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
    </ListWidget>
  );
};

export default SkillListWidget;
