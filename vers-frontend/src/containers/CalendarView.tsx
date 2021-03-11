import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Event, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import CalEventForm from "src/components/forms/CalEventForm";
import MyDialog from "src/components/commons/Dialog";

import { getData, getSync } from "src/selectors";
import { downloadExcel, saveData } from "src/slices/data";
import { submitExcel } from "src/slices/sync";
import { CalEvent, ItemType } from "src/kernel";
import ExcelProcessor2 from "src/kernel/ExcelProcessor2";

const useStyles = makeStyles((theme) => ({
  form: {},
  formTitle: {},
  formContent: {},
}));

const localizer = momentLocalizer(moment);

interface ICalendarViewProps {}

const myEventsList: Event[] = [
  {
    title: "test",
    start: new Date(),
    end: new Date(),
    allDay: true,
  },
];

const CalendarView: React.FC<ICalendarViewProps> = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { newCalEvent } = useSelector(getData);
  const { feedback } = useSelector(getSync);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState(newCalEvent);
  React.useEffect(() => {
    setFormData(newCalEvent);
  }, [newCalEvent]);
  React.useEffect(() => {
    setFormOpen(!!feedback);
  }, [feedback]);

  const handleSubmit = (data: CalEvent) => {
    dispatch(saveData(data));
    setFormOpen(false);
  };


  let [fbOpen, setFbOpen] = React.useState(false);

  const handleUploadExcel = async (file: File) => {
    try {
      let ans = await ExcelProcessor2.readCalEventFile(file);
      dispatch(submitExcel({ type: ItemType.CalEvent, data: ans }));
    } catch (e) {
      setFbOpen(true);
    }
  };

  const handleFbClose = () => {
    setFbOpen(false);
  };

  const handleExcelDownloadClick = async () => {
    dispatch(downloadExcel({ type: ItemType.CalEvent }));
  };

  return (
    <React.Fragment>
      <div>
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
      <MyDialog open={formOpen} onClose={() => setFormOpen(false)}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Add New Event
            </Typography>
          </div>
          <div className={classes.formContent}>
            {formData ? (
              <CalEventForm
                data={formData}
                feedback={feedback}
                onSubmit={handleSubmit}
              />
            ) : null}
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
