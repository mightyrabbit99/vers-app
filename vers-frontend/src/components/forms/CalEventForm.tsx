import * as React from "react";

import { Grid, Button } from "@material-ui/core";
import { CalEvent } from "src/kernel";
import CalEventFormFields from "./CalEventFormFields";

interface ICalEventFormProps {
  data: CalEvent;
  feedback?: any;
  onSubmit: (p: CalEvent) => void;
  onChange?: (p: CalEvent) => void;
  onCancel?: () => void;
}

const CalEventForm: React.FC<ICalEventFormProps> = (
  props
) => {
  const { data, feedback, onSubmit, onChange, onCancel } = props;
  const newData = { ...data };

  const handleSubmit = () => {
    onSubmit(newData);
  };

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <CalEventFormFields
            data={newData}
            feedback={feedback}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12}>
          <div>
            {onCancel ? <Button onClick={onCancel}>Cancel</Button> : null}
            {!onChange ? <Button onClick={handleSubmit}>Submit</Button> : null}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CalEventForm;
