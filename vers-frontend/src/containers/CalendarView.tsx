import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloudDownload from "@material-ui/icons/CloudDownload";
import CloudUpload from "@material-ui/icons/CloudUpload";

import CalEventForm from "src/components/forms/CalEventForm";
import MyDialog from "src/components/commons/Dialog";

import { getData, getSync } from "src/selectors";
import { delData, downloadExcel, saveData } from "src/slices/data";
import { clearFeedback, submitExcel } from "src/slices/sync";
import { CalEvent, ItemType } from "src/kernel";
import ExcelProcessor2 from "src/kernel/ExcelProcessor2";
import ExcelUploadForm from "src/components/forms/ExcelUploadForm";
import { calExcelUrl } from "src/kernel/Fetcher";
import Calendar, { Event } from "src/components/calendar/Calendar";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "89vh",
  },
  ctrlButtons: {
    "& > *": {
      margin: theme.spacing(1),
    },
    display: "flex",
    flexDirection: "row",
    height: "10%",
    width: "100%",
  },
  rightOffset: {
    width: 50,
  },
  leftButton: {
    marginLeft: "auto",
  },
  content: {
    height: "90%",
  },
  form: {
    maxWidth: "60vw",
    width: 500,
    minWidth: 300,
  },
  formTitle: {
    display: "flex",
  },
  formContent: {},
}));

interface ICalendarViewProps {}

const CalendarView: React.FC<ICalendarViewProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { calEvents, newCalEvent } = useSelector(getData);
  const { feedback } = useSelector(getSync);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<CalEvent>();
  React.useEffect(() => {
    setFormData((formData) => formData ?? newCalEvent);
  }, [newCalEvent]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleDelete = () => {
    formData && dispatch(delData(formData));
    setFormOpen(false);
  };

  const handleSubmit = (data: CalEvent) => {
    dispatch(saveData(data));
    setFormOpen(false);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    dispatch(clearFeedback());
  };

  let [fbOpen, setFbOpen] = React.useState(false);

  const handleFbClose = () => {
    setFbOpen(false);
  };

  const handleExcelDownloadClick = async () => {
    dispatch(downloadExcel({ type: ItemType.CalEvent }));
  };

  const [excelFormOpen, setExcelFormOpen] = React.useState(false);

  const handleExcelUploadClick = () => {
    setExcelFormOpen(true);
  };

  const handleExcelFileUpload = async (file: File) => {
    setExcelFormOpen(false);
    try {
      let ans = await ExcelProcessor2.readCalEventFile(file);
      dispatch(submitExcel({ type: ItemType.CalEvent, data: ans }));
    } catch (e) {
      setFbOpen(true);
    }
  };

  const handleExcelFormClose = () => {
    setExcelFormOpen(false);
    dispatch(clearFeedback());
  };

  const handleSelectEvent = (e: Event) => {
    setFormData(e.resource);
    setFormOpen(true);
  };

  const handleSelectDate = (a: Date) => {
    let dd = a.toISOString().slice(0, 10);
    if (!formData) return;
    setFormData({ ...formData, start: dd, end: dd });
    setFormOpen(true);
  };

  const handleCreateNewOnClick = () => {
    setFormData(newCalEvent);
    setFormOpen(true);
  };

  const myEventsList: Event[] = Object.values(calEvents).map((x) => ({
    title: x.title,
    start: new Date(x.start),
    end: new Date(x.end),
    allDay: true,
    resource: x,
  }));

  return (
    <React.Fragment>
      <div className={classes.root}>
        <div className={classes.ctrlButtons}>
          <IconButton
            onClick={handleExcelDownloadClick}
            className={classes.leftButton}
          >
            <CloudDownload />
          </IconButton>
          <IconButton onClick={handleExcelUploadClick}>
            <CloudUpload />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNewOnClick}
          >
            Add
          </Button>
          <div className={classes.rightOffset} />
        </div>
        <div className={classes.content}>
          <Calendar
            events={myEventsList}
            onSelectEvent={handleSelectEvent}
            onSelectDate={handleSelectDate}
          />
        </div>
      </div>
      <MyDialog open={formOpen} onClose={handleFormClose}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              {formData && formData.id === -1
                ? "Add New Event"
                : "Edit/Delete Event"}
            </Typography>
            {formData && formData.id !== -1 ? (
              <Button onClick={handleDelete}>Delete</Button>
            ) : null}
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <CalEventForm
                data={formData}
                feedback={feedback}
                onSubmit={handleSubmit}
                onCancel={handleFormClose}
              />
            ) : null}
          </div>
        </div>
      </MyDialog>
      <MyDialog open={excelFormOpen} onClose={handleExcelFormClose}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Upload Excel Data
            </Typography>
          </div>
          <div className={classes.formContent}>
            <ExcelUploadForm
              feedback={feedback}
              onSubmit={handleExcelFileUpload}
              onCancel={handleExcelFormClose}
              templateUrl={calExcelUrl}
            />
          </div>
        </div>
      </MyDialog>
      <Snackbar open={fbOpen} autoHideDuration={6000} onClose={handleFbClose}>
        <Alert onClose={handleFbClose} severity={"error"}>
          {"Upload failed: Make sure you use the correct format"}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default CalendarView;
