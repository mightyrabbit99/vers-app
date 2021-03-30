import * as React from "react";

import { Grid, Button } from "@material-ui/core";
import { CalcVars } from "src/kernel";
import CalcVarsFormFields from "./CalcVarsFormFields";

interface ICalcVarsFormProps {
  data: CalcVars;
  feedback?: any;
  onSubmit: (p: CalcVars) => void;
  onChange?: (p: CalcVars) => void;
  onCancel?: () => void;
}

const CalcVarsForm: React.FC<ICalcVarsFormProps> = (props) => {
  const { data, feedback, onSubmit, onChange, onCancel } = props;
  const newData = { ...data };

  const handleSubmit = () => {
    onSubmit(newData);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <CalcVarsFormFields
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
  );
};

export default CalcVarsForm;
