import * as React from "react";
import { Typography, Button, makeStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PublishIcon from "@material-ui/icons/Publish";

import { Plant } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import PlantForm from "src/components/forms/PlantForm";
import PlantList from "src/components/lists/PlantMainList";
import ExcelProcessor from "src/kernel/ExcelProcessor";

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
  iconButton: {
    height: "100%",
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
  edit?: boolean;
  onSubmit: (p: Plant) => void;
  onDelete: (...ps: Plant[]) => void;
  onReset: () => void;
}

const PlantListWidget: React.FunctionComponent<IPlantListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const {
    lst,
    newPlant,
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
  const [formData, setFormData] = React.useState(newPlant);
  React.useEffect(() => {
    setFormData(newPlant);
  }, [newPlant]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: Plant) => {
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
    setFormData(newPlant);
    setFormOpen(true);
  };

  const handleExcelFileUpload = async (e: React.ChangeEvent<any>) => {
    const { files } = e.target;
    console.log(files[0]);
    let ep = new ExcelProcessor();
    let lst = await ep.readPlantFile(files[0]);
    console.log(lst);
  };

  return (
    <React.Fragment>
      <input
        hidden
        id="icon-excel-upload-button"
        onChange={handleExcelFileUpload}
        type="file"
      />
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
          <label htmlFor="icon-excel-upload-button">
            <IconButton
              className={classes.iconButton}
              color="primary"
              aria-label="upload excel"
              component="span"
            >
              <PublishIcon />
            </IconButton>
          </label>
          <Button
            disabled={!edit}
            variant="contained"
            color="primary"
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
        <PlantList
          lst={Object.values(lst)}
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
                onCancel={handleFormClose}
              />
            ) : null}
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default PlantListWidget;
