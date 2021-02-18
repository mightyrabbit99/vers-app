import * as React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";

import { Department } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import DepartmentForm from "src/components/forms/DepartmentForm";
import DepartmentList from "src/components/lists/DepartmentMainList";

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

interface IDepartmentListWidgetProps {
  lst: { [id: number]: Department };
  newDepartment?: Department;
  feedback?: any;
  edit?: boolean;
  onSubmit: (p: Department) => void;
  onDelete: (...ps: Department[]) => void;
  onReset: () => void;
}

const DepartmentListWidget: React.FunctionComponent<IDepartmentListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const { lst, newDepartment, feedback, edit = true, onSubmit, onDelete, onReset } = props;

  const [selected, setSelected] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSelected([]);
  }, []);
  const handleDeleteOnClick = () => {
    onDelete(...selected.map((x) => lst[x]));
    setSelected([]);
  };

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(newDepartment);
  React.useEffect(() => {
    setFormData(newDepartment);
  }, [newDepartment]);

  const handleSubmit = (data: Department) => {
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
  }

  const handleCreateOnClick = () => {
    setFormData(newDepartment);
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
          Departments
        </Typography>
        <div className={classes.ctrlButtons}>
          <Button disabled={!edit} variant="contained" color="primary" onClick={handleCreateOnClick}>
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
        <DepartmentList
          lst={Object.values(lst)}
          selected={selected}
          selectedOnChange={setSelected}
          onEdit={edit? handleEditOnClick: undefined}
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
                ? "Create New Department"
                : "Edit Department"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <DepartmentForm
                data={formData}
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

export default DepartmentListWidget;
