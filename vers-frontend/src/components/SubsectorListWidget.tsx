import * as React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";

import { Sector, Subsector } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import SubsectorForm from "src/components/forms/SubsectorForm";
import SubsectorList from "src/components/lists/SubsectorMainList";

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

interface ISubsectorListWidgetProps {
  lst: { [id: number]: Subsector };
  sectorLst: { [id: number]: Sector };
  newSubsector?: Subsector;
  feedback?: any;
  onSubmit: (p: Subsector) => void;
  onDelete: (...ps: Subsector[]) => void;
}

const SubsectorListWidget: React.FunctionComponent<ISubsectorListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const { lst, sectorLst, newSubsector, feedback, onSubmit, onDelete } = props;

  const [selected, setSelected] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSelected([]);
  }, []);
  const handleDeleteOnClick = () => {
    onDelete(...selected.map((x) => lst[x]));
    setSelected([]);
  };

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(newSubsector);
  React.useEffect(() => {
    setFormData(newSubsector);
  }, [newSubsector]);

  const handleSubmit = (data: Subsector) => {
    onSubmit(data);
    setFormOpen(false);
  };
  const handleEditOnClick = (id: number) => {
    setFormData(lst[id]);
    setFormOpen(true);
  };

  const handleCreateOnClick = () => {
    setFormData(newSubsector);
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
          Subsectors
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
        <SubsectorList
          lst={lst}
          sectorLst={sectorLst}
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
                ? "Create New Subsector"
                : "Edit Subsector"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <SubsectorForm
                data={formData}
                sectorLst={sectorLst}
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

export default SubsectorListWidget;
