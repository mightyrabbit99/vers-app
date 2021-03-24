import * as React from "react";

import { Grid, Button } from "@material-ui/core";
import { Plant } from "src/kernel";
import PlantFormFields from "./PlantFormFields";

interface IPlantFormProps {
  data: Plant;
  feedback?: any;
  onSubmit: (p: Plant) => void;
  onChange?: (p: Plant) => void;
  onCancel?: () => void;
}

const PlantForm: React.FC<IPlantFormProps> = (props) => {
  const { data, feedback, onSubmit, onChange, onCancel } = props;
  const newData = { ...data };

  const handleSubmit = () => {
    onSubmit(newData);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <PlantFormFields
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

export default PlantForm;
