import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Employee, Subsector, Department } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import EmployeeForm from "src/components/forms/EmployeeForm";
import EmployeeList from "src/components/lists/EmployeeMainList";
import ListWidget from "./ListWidget";
import { empExcelUrl } from "src/kernel/Fetcher";

const useStyles = makeStyles((theme) => ({
  title: {
    height: "15%",
  },
  form: {
    width: 700,
    minWidth: 600,
  },
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IEmployeeListWidgetProps {
  lst: { [id: number]: Employee };
  subsectorLst: { [id: number]: Subsector };
  departmentLst: { [id: number]: Department };
  newEmployee?: Employee;
  feedback?: any;
  edit?: boolean;
  onSubmit: (p: Employee) => void;
  onDelete: (...ps: Employee[]) => void;
  onReset: () => void;
  uploadExcel?: (file: File) => void;
  downloadExcel?: () => void;
}

const EmployeeListWidget: React.FC<IEmployeeListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const {
    lst,
    subsectorLst,
    departmentLst,
    newEmployee,
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
  const [formData, setFormData] = React.useState<Employee>();
  React.useEffect(() => {
    setFormData(formData => formData ?? newEmployee);
  }, [newEmployee]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: Employee) => {
    onSubmit(data);
    setFormOpen(false);
  };
  const handleEditOnClick = (id: number) => {
    setFormData(lst[id]);
    setFormOpen(true);
  };

  const handleCreateOnClick = () => {
    setFormData(newEmployee);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    onReset();
  };

  return (
    <ListWidget
      title="Employees"
      disableCreate={!edit}
      disableDelete={selected.length === 0 || !edit}
      createOnClick={handleCreateOnClick}
      deleteOnClick={handleDeleteOnClick}
      downloadExcel={downloadExcel}
      uploadExcel={uploadExcel}
      excelTemplateUrl={empExcelUrl}
    >
      <EmployeeList
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
                ? "Create New Employee"
                : "Edit Employee"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <EmployeeForm
                data={formData}
                employeeLst={lst}
                subsectorLst={subsectorLst}
                departmentLst={departmentLst}
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

export default EmployeeListWidget;
