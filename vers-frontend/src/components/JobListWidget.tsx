import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Job, Subsector } from "src/kernel";
import JobList from "src/components/lists/JobMainList";
import JobForm from "src/components/forms/JobForm";
import MyDialog from "src/components/commons/Dialog";
import ListWidget from "./ListWidget";

const useStyles = makeStyles((theme) => ({
  title: {
    height: "15%",
  },
  form: {},
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IJobListWidgetProps {
  lst: { [id: number]: Job };
  subsectorLst: { [id: number]: Subsector };
  newJob?: Job;
  feedback?: any;
  edit?: boolean;
  onSubmit: (p: Job) => void;
  onDelete: (...ps: Job[]) => void;
  onReset: () => void;
  uploadExcel?: (file: File) => void;
  downloadExcel?: () => void;
}

const JobListWidget: React.FunctionComponent<IJobListWidgetProps> = (props) => {
  const classes = useStyles();
  const {
    lst,
    subsectorLst,
    newJob,
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
  const [formData, setFormData] = React.useState(newJob);
  React.useEffect(() => {
    setFormData(newJob);
  }, [newJob]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: Job) => {
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
    setFormData(newJob);
    setFormOpen(true);
  };

  return (
    <ListWidget
      title="Jobs"
      disableCreate={!edit}
      disableDelete={selected.length === 0 || !edit}
      createOnClick={handleCreateOnClick}
      deleteOnClick={handleDeleteOnClick}
      downloadExcel={downloadExcel}
      uploadExcel={uploadExcel}
    >
      <JobList
        lst={lst}
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
              {formData && formData.id === -1 ? "Create New Job" : "Edit Job"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <JobForm
                data={formData}
                feedback={feedback}
                subsectorLst={subsectorLst}
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

export default JobListWidget;
