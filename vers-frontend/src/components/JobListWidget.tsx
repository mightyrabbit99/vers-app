import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import { Job } from "src/kernel";
import JobList from "src/components/lists/JobMainList";
import JobForm from "src/components/forms/JobForm";
import MyDialog from "src/components/commons/Dialog";

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

interface IJobListWidgetProps {
  lst: { [id: number]: Job };
  newJob?: Job;
  feedback?: any;
  edit?: boolean;
  onSubmit: (p: Job) => void;
  onDelete: (...ps: Job[]) => void;
  onReset: () => void;
}

const JobListWidget: React.FunctionComponent<IJobListWidgetProps> = (props) => {
  const classes = useStyles();
  const {
    lst,
    newJob,
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
    <React.Fragment>
      <div className={classes.header}>
        <Typography
          className={classes.title}
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
        >
          Jobs
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
        <JobList
          lst={lst}
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
              {formData && formData.id === -1 ? "Create New Job" : "Edit Job"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <JobForm
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

export default JobListWidget;
