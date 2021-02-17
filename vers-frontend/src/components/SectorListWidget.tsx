import * as React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";

import { Plant, Sector } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import SectorForm from "src/components/forms/SectorForm";
import SectorList from "src/components/lists/SectorMainList";

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

interface ISectorListWidgetProps {
  lst: { [id: number]: Sector };
  plantLst: { [id: number]: Plant };
  newSector?: Sector;
  feedback?: any;
  onSubmit: (p: Sector) => void;
  onDelete: (...ps: Sector[]) => void;
}

const SectorListWidget: React.FunctionComponent<ISectorListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const { lst, plantLst, newSector, feedback, onSubmit, onDelete } = props;

  const [selected, setSelected] = React.useState<number[]>([]);
  React.useEffect(() => {
    setSelected([]);
  }, []);
  const handleDeleteOnClick = () => {
    onDelete(...selected.map((x) => lst[x]));
    setSelected([]);
  };

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(newSector);
  React.useEffect(() => {
    setFormData(newSector);
  }, [newSector]);

  const handleSubmit = (data: Sector) => {
    onSubmit(data);
    setFormOpen(false);
  };
  const handleEditOnClick = (id: number) => {
    setFormData(lst[id]);
    setFormOpen(true);
  };

  const handleCreateOnClick = () => {
    setFormData(newSector);
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
          Sectors
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
        <SectorList
          lst={lst}
          plantLst={plantLst}
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
                ? "Create New Sector"
                : "Edit Sector"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <SectorForm
                data={formData}
                plantLst={plantLst}
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

export default SectorListWidget;
