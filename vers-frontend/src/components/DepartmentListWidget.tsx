import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Department } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import DepartmentForm from "src/components/forms/DepartmentForm";
import DepartmentList from "src/components/lists/DepartmentMainList";
import ListWidget from "./ListWidget";

const useStyles = makeStyles((theme) => ({
  title: {
    height: "15%",
  },
  form: {
    width: 400,
  },
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
  uploadExcel?: (file: File) => void;
  downloadExcel?: () => void;
}

const DepartmentListWidget: React.FC<IDepartmentListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const {
    lst,
    newDepartment,
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
  const [formData, setFormData] = React.useState<Department>();
  React.useEffect(() => {
    setFormData(formData => formData ?? newDepartment);
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
  };

  const handleCreateOnClick = () => {
    setFormData(newDepartment);
    setFormOpen(true);
  };

  return (
    <ListWidget
      title="Departments"
      disableCreate={!edit}
      disableDelete={selected.length === 0 || !edit}
      createOnClick={handleCreateOnClick}
      deleteOnClick={handleDeleteOnClick}
      downloadExcel={downloadExcel}
      uploadExcel={uploadExcel}
    >
      <DepartmentList
        lst={Object.values(lst)}
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
    </ListWidget>
  );
};

export default DepartmentListWidget;
