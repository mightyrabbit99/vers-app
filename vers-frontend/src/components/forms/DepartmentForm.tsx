import * as React from "react";

import { Grid, Button } from "@material-ui/core";
import { Department } from "src/kernel";
import DepartmentFormFields from "./DepartmentFormFields";

interface IDepartmentFormProps {
  data: Department;
  feedback?: any;
  onSubmit: (p: Department) => void;
  onChange?: (p: Department) => void;
  onCancel?: () => void;
}

const DepartmentForm: React.FC<IDepartmentFormProps> = (
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
          <DepartmentFormFields
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

export default DepartmentForm;
