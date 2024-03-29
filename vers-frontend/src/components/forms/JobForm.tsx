import * as React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Job, Subsector, Feedback } from "src/kernel";
import JobFormFields, { JobFormChoices } from "./JobFormFields";

interface IJobFormProps {
  data: Job;
  feedback?: Feedback<Job>;
  subsectorLst: { [id: number]: Subsector };
  onSubmit: (job: Job) => void;
  onChange?: (job: Job) => void;
  onCancel?: () => void;
}

const JobForm: React.FC<IJobFormProps> = (props) => {
  const { data, feedback, subsectorLst, onSubmit, onChange, onCancel } = props;
  const newData = { ...data };
  const subsectors = Object.values(subsectorLst);
  const choices: JobFormChoices = {
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
        <JobFormFields
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

export default JobForm;
