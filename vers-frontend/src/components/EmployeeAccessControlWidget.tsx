import * as React from 'react';
import { Employee } from 'src/kernel';

interface IEmpAccessCtrlProps {
  lst: { [id: number]: Employee };
  onSubmit: (p: Employee) => void;
}

const EmpAccessCtrl: React.FunctionComponent<IEmpAccessCtrlProps> = (props) => {
  const { lst, onSubmit } = props;
  return <div/>;
};

export default EmpAccessCtrl;
