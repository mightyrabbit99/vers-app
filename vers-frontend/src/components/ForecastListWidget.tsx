import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { Forecast } from "src/kernel";
import ForecastMainList from "./lists/ForecastMainList";
import ListWidget from "./ListWidget";
import MyDialog from "src/components/commons/Dialog";
import ForecastForm from "src/components/forms/ForecastForm";
import { forecastExcelUrl } from "src/kernel/Fetcher";

const useStyles = makeStyles((theme) => ({
  title: {
    height: "15%",
  },
  form: {
    maxWidth: "60vw",
    width: "fit-content",
    minWidth: 300,
  },
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IForecastListWidgetProps {
  title?: string;
  lst: { [id: number]: Forecast };
  fNLst?: number[];
  newForecast?: Forecast;
  edit?: boolean;
  feedback?: any;
  onSubmit: (f: Forecast) => void;
  onDelete: (...f: Forecast[]) => void;
  onReset: () => void;
  uploadExcel?: (file: File) => void;
  downloadExcel?: () => void;
}

const ForecastListWidget: React.FC<IForecastListWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const {
    title,
    lst,
    fNLst,
    newForecast,
    edit = true,
    feedback,
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
  const [formData, setFormData] = React.useState<Forecast>();
  React.useEffect(() => {
    setFormData(formData => formData ?? newForecast);
  }, [newForecast]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: Forecast) => {
    onSubmit(data);
    setFormOpen(false);
  };

  const handleCreateOnClick = () => {
    setFormData(newForecast);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    onReset();
  };

  return (
    <ListWidget
      title={title ?? "Forecasts"}
      disableCreate={!edit}
      disableDelete={selected.length === 0 || !edit}
      createOnClick={handleCreateOnClick}
      deleteOnClick={handleDeleteOnClick}
      downloadExcel={downloadExcel}
      uploadExcel={uploadExcel}
      excelTemplateUrl={forecastExcelUrl}
    >
      <ForecastMainList
        lst={lst}
        fNLst={fNLst}
        onSubmit={handleSubmit}
        selected={selected}
        selectedOnChange={setSelected}
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
                ? "Create New Forecast"
                : "Edit Forecast"}
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <ForecastForm
                data={formData}
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

export default ForecastListWidget;
