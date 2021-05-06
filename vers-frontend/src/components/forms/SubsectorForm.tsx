import * as React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Subsector, Sector, Feedback } from "src/kernel";
import SubsectorFormFields, {
  SubsectorFormChoices,
} from "./SubsectorFormFields";

interface ISubsectorFormProps {
  data: Subsector;
  feedback?: Feedback<Subsector>;
  sectorLst: { [id: number]: Sector };
  onSubmit: (p: Subsector) => void;
  onChange?: (p: Subsector) => void;
  onCancel?: () => void;
}

const SubsectorForm: React.FC<ISubsectorFormProps> = (props) => {
  const { data, feedback, sectorLst, onSubmit, onChange, onCancel } = props;
  const newData = { ...data };
  const sectors = Object.values(sectorLst);
  const choices: SubsectorFormChoices = {
    sector: {
      choices: sectors.map((x) => ({
        name: x.name,
        value: x.id,
      })),
      init: sectors.findIndex((x) => x.id === data.sector),
    },
  };

  const handleSubmit = () => {
    onSubmit(newData);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SubsectorFormFields
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

export default SubsectorForm;
