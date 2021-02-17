import * as React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";

import { Plant } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import PlantForm from "src/components/forms/PlantForm";
import PlantList from "src/components/lists/PlantMainList";

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

interface IPlantListWidgetProps {
  lst: { [id: number]: Plant };
  newPlant?: Plant;
  feedback?: any;
  onSubmit: (p: Plant) => void;
  onDelete: (...ps: Plant[]) => void;
}

const PlantListWidget: React.FunctionComponent<IPlantListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const { lst, newPlant, feedback, onSubmit, onDelete } = props;

  const [selected, setSelected] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSelected([]);
  }, []);
  const handleDeleteOnClick = () => {
    onDelete(...selected.map((x) => lst[x]));
    setSelected([]);
  };

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(newPlant);
  React.useEffect(() => {
    setFormData(newPlant);
  }, [newPlant]);

  const handleSubmit = (data: Plant) => {
    onSubmit(data);
    setFormOpen(false);
  };
  const handleEditOnClick = (id: number) => {
    setFormData(lst[id]);
    setFormOpen(true);
  };

  const handleCreateOnClick = () => {
    setFormData(newPlant);
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
          Plants
        </Typography>
        <div className={classes.ctrlButtons}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOnClick}
          >
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
        <PlantList
          lst={Object.values(lst)}
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
                ? "Create New Plant"
                : "Edit Plant"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <PlantForm
                data={formData}
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

export default PlantListWidget;
