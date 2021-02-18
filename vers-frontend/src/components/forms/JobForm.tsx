import * as React from 'react';
import { Job } from 'src/kernel';

interface IJobFormProps {
  data: Job;
  feedback?: any;
  onSubmit: (job: Job) => void;
  onCancel: () => void;
}

const JobForm: React.FunctionComponent<IJobFormProps> = (props) => {
  return <div/>;
};

export default JobForm;
