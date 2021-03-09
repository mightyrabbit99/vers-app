import * as React from "react";

import { Grid, Button } from "@material-ui/core";
import { Skill, Subsector } from "src/kernel";
import SkillFormFields, { SkillFormChoices } from "./SkillFormFields";

interface ISkillFormProps {
  data: Skill;
  feedback?: any;
  subsectorLst: { [id: number]: Subsector };
  onSubmit: (p: Skill) => void;
  onChange?: (p: Skill) => void;
  onCancel?: () => void;
}

const SkillForm: React.FunctionComponent<ISkillFormProps> = (props) => {
  const { data, feedback, subsectorLst, onSubmit, onChange, onCancel } = props;
  const newData = { ...data };
  const subsectors = Object.values(subsectorLst);
  const choices: SkillFormChoices = {
    subsector: {
      choices: subsectors.map((x) => ({
        name: x.name,
        value: x.id,
      })),
      init: subsectors.findIndex((x) => x.id === data.subsector),
    },
  };

  const handleSubmit = () => {
    onSubmit(newData);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SkillFormFields
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

export default SkillForm;
