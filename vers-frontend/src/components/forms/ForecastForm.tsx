import * as React from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Forecast, Feedback } from "src/kernel";

interface IForecastFormProps {
  data: Forecast;
  feedback?: Feedback<Forecast>;
  onSubmit: (p: Forecast) => void;
  onChange?: (p: Forecast) => void;
  onCancel?: () => void;
}

const ForecastForm: React.FC<IForecastFormProps> = (props) => {
  const { data, feedback, onSubmit, onChange, onCancel } = props;
  const [state, setState] = React.useState(data);
  React.useEffect(() => {
    setState(data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    let { name, value } = e.target;
    if (name === "on") {
      value = `${value}-01`;
    }

    onChange
      ? onChange({ ...state, [name]: value })
      : setState({ ...state, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(state);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          required
          label="Date"
          variant="standard"
          name="on"
          value={state.on.substr(0, 7)}
          onChange={handleChange}
          error={!!feedback?.on}
          type="month"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <div>
          {onCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
          {!onChange ? <Button onClick={handleSubmit}>Submit</Button> : null}
        </div>
      </Grid>
    </Grid>
  );
};

export default ForecastForm;
