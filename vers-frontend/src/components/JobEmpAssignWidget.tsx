import * as React from 'react';
import { Employee, Job, Skill } from 'src/kernel';

interface IJobEmpAssignWidgetProps {
  lst: { [id: number]: Job };
  empLst: { [id: number]: Employee };
  skillLst: { [id: number]: Skill };
  onSubmit?: (j: Job) => void;
}

const JobEmpAssignWidget: React.FC<IJobEmpAssignWidgetProps> = (props) => {
  return <div/>;
};

export default JobEmpAssignWidget;
