import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Employee, Feedback, ItemType } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import EmployeeForm from "src/components/forms/EmployeeForm";
import EmployeeList from "src/components/lists/EmployeeMainList";
import ListWidget from "./ListWidget";
import { empExcelUrl } from "src/kernel/Fetcher";
import { toRegExp } from "src/utils/tools";
import { ViewContext } from "src/contexts";

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
  newEmployee?: Employee;
  feedback?: Feedback<Employee>;
  edit?: boolean;
  onSubmit: (p: Employee) => void;
  onDelete: (...ps: Employee[]) => void;
  onReset: () => void;
  uploadExcel?: (file: File) => void;
  downloadExcel?: () => void;
}

const EmployeeListWidget: React.FC<IEmployeeListWidgetProps> = (props) => {
  const classes = useStyles();
  const {
    lst: l,
    newEmployee,
    feedback,
    edit = true,
    onSubmit,
    onDelete,
    onReset,
    uploadExcel,
    downloadExcel,
  } = props;

  const [lst, setLst] = React.useState(l);
  const [searchTerm, setSearchTerm] = React.useState("");
  React.useEffect(() => {
    if (searchTerm === "") {
      setLst(l);
    } else {
      const reg = toRegExp(searchTerm);
      setLst(
        Object.fromEntries(
          Object.entries(l).filter(
            ([x, y]) => reg.test(y.firstName) || reg.test(y.lastName)
          )
        )
      );
    }
  }, [l, searchTerm]);

  const handleFilter = (term: string) => {
    setSearchTerm(term);
  };

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
    setFormData((formData) => formData ?? newEmployee);
  }, [newEmployee]);
  React.useEffect(() => {
    setFormOpen(!!feedback && feedback._type === ItemType.Employee);
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
      searchOnChange={handleFilter}
      excelTemplateUrl={empExcelUrl}
    >
      <ViewContext.Consumer>
        {({ viewWidth }) => {
          return (
            <EmployeeList
              lst={lst}
              selected={selected}
              selectedOnChange={setSelected}
              onEdit={edit ? handleEditOnClick : undefined}
              width={viewWidth}
            />
          );
        }}
      </ViewContext.Consumer>
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
