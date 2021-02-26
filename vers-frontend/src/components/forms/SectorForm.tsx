import * as React from "react";

import { Grid, Button } from "@material-ui/core";
import { Sector, Plant } from "src/kernel";
import SectorFormFields, { SectorFormChoices } from "./SectorFormFields";

interface ISectorFormProps {
  data: Sector;
  feedback?: any;
  plantLst: { [id: number]: Plant };
  onSubmit: (p: Sector) => void;
  onChange?: (p: Sector) => void;
  onCancel?: () => void;
}

const SectorForm: React.FunctionComponent<ISectorFormProps> = (props) => {
  const { data, feedback, plantLst, onSubmit, onChange, onCancel } = props;
  const newData = { ...data };
  const choices: SectorFormChoices = {
    plant: {
      choices: [{name: plantLst[data.plant]?.name, value: plantLst[data.plant]?.id}],/*plants.map((x) => ({
        name: x.name,
        value: x.id,
      })),*/
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
