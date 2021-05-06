import * as React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Sector, Plant, Feedback } from "src/kernel";
import SectorFormFields, { SectorFormChoices } from "./SectorFormFields";

interface ISectorFormProps {
  data: Sector;
  feedback?: Feedback<Sector>;
  plantLst: { [id: number]: Plant };
  onSubmit: (p: Sector) => void;
  onChange?: (p: Sector) => void;
  onCancel?: () => void;
}

const SectorForm: React.FC<ISectorFormProps> = (props) => {
  const { data, feedback, plantLst, onSubmit, onChange, onCancel } = props;
  const newData = { ...data };
  const choices: SectorFormChoices = {
    plant: {
      choices: [
        { name: plantLst[data.plant]?.name, value: plantLst[data.plant]?.id },
      ],
      init: 0,
    },
  };

  const handleSubmit = () => {
    onSubmit(newData);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SectorFormFields
          data={newData}
          choices={choices}
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

export default SectorForm;
