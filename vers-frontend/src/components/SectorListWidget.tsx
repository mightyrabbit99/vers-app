import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Plant, Sector } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import SectorForm from "src/components/forms/SectorForm";
import SectorList from "src/components/lists/SectorMainList";

import ListWidget from "src/components/commons/ListWidget";

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

interface ISectorListWidgetProps {
  lst: { [id: number]: Sector };
  plantLst: { [id: number]: Plant };
  newSector?: Sector;
  feedback?: any;
  edit?: boolean;
  onSubmit: (p: Sector) => void;
  onDelete: (...ps: Sector[]) => void;
  onReset: () => void;
  uploadExcel?: () => void;
  downloadExcel?: () => void;
}

const SectorListWidget: React.FunctionComponent<ISectorListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const {
    lst,
    plantLst,
    newSector,
    feedback,
    edit = true,
    onSubmit,
    onDelete,
    onReset,
    uploadExcel = () => {},
    downloadExcel = () => {},
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
  const [formData, setFormData] = React.useState(newSector);
  React.useEffect(() => {
    setFormData(newSector);
  }, [newSector]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: Sector) => {
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
    setFormData(newSector);
    setFormOpen(true);
  };

  return (
    <ListWidget
      title="Sectors"
      disableCreate={!edit}
      disableDelete={selected.length === 0 || !edit}
      createOnClick={handleCreateOnClick}
      deleteOnClick={handleDeleteOnClick}
      downloadOnClick={downloadExcel}
      uploadOnClick={uploadExcel}
    >
      <SectorList
        lst={lst}
        plantLst={plantLst}
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
                onCancel={handleFormClose}
              />
            ) : null}
          </div>
        </div>
      </MyDialog>
    </ListWidget>
  );
};

export default SectorListWidget;
