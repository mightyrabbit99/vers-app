import * as React from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { CalEvent } from "src/kernel";

interface ICalEventFormProps {
  data: CalEvent;
  feedback?: any;
  onChange?: (data: CalEvent) => void;
}

const CalEventForm: React.FunctionComponent<ICalEventFormProps> = (props) => {
  const { data, feedback: fb, onChange } = props;
  const [state, setState] = React.useState(data);
  const [feedback, setFeedback] = React.useState(fb ?? {});

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    data[name] = value;
    setFeedback({ ...feedback, [name]: undefined });
    onChange ? onChange(data) : setState({ ...state, [name]: value });
  };

  const getFeedback = (name: string) => {
    return feedback[name] ?? "";
  };

  const genActiveProps = (name: string) => ({
    name,
    value: state[name],
    onChange: handleChange,
    error: getFeedback(name) !== "",
    helperText: getFeedback(name),
  });

  return (
    <Grid container>
      <Grid item xs={12}>
        <TextField
          label="Title"
          variant="outlined"
          {...genActiveProps("title")}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Start"
          type="date"
          {...genActiveProps("start")}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12}>
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
  );
};

export default CalEventForm;
