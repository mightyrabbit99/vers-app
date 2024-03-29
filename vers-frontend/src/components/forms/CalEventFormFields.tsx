import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import { CalEvent, Feedback } from "src/kernel";
import { commonFormFieldStyles } from "./types";

const useStyles = makeStyles(commonFormFieldStyles);


interface ICalEventFormProps {
  data: CalEvent;
  feedback?: Feedback<CalEvent>;
  onChange?: (data: CalEvent) => void;
}

const CalEventForm: React.FC<ICalEventFormProps> = (props) => {
  const classes = useStyles();
  const { data, feedback: fb, onChange } = props;
  const [state, setState] = React.useState(data);
  const [feedback, setFeedback] = React.useState<Feedback<CalEvent>>();
  React.useEffect(() => {
    setState(data);
  }, [data]);
  React.useEffect(() => {
    setFeedback(fb);
  }, [fb]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    data[name as keyof CalEvent] = value as never;
    setFeedback(feedback ? { ...feedback, [name]: undefined } : undefined);
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const getFeedback = (name: keyof CalEvent) => {
    return feedback && name in feedback ? feedback[name] : "";
  };

  const genActiveProps = (name: keyof CalEvent) => ({
    name,
    value: state[name],
    onChange: handleChange,
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <Grid container className={classes.form} spacing={2}>
        <Grid item xs={12} sm={7}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            {...genActiveProps("title")}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Event Type"
            variant="outlined"
            {...genActiveProps("eventType")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start"
            type="date"
            {...genActiveProps("start")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="End"
            type="date"
            {...genActiveProps("end")}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default CalEventForm;
