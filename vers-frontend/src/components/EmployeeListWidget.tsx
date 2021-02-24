import * as React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";

import { Employee, Subsector, Department } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import EmployeeForm from "src/components/forms/EmployeeForm";
import EmployeeList from "src/components/lists/EmployeeMainList";

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
}

const EmployeeListWidget: React.FunctionComponent<IEmployeeListWidgetProps> = (
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
  const [formData, setFormData] = React.useState(newEmployee);
  React.useEffect(() => {
    setFormData(newEmployee);
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
          Employees
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
        <EmployeeList
          lst={lst}
          departmentLst={departmentLst}
          subsectorLst={subsectorLst}
          selected={selected}
          selectedOnChange={setSelected}
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
    </React.Fragment>
  );
};

export default EmployeeListWidget;
