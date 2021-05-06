import * as React from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Employee, Feedback } from "src/kernel";
import EmployeeFormFields, { EmployeeFormChoices } from "./EmployeeFormFields";

interface IEmployeeFormProps {
  data: Employee;
  feedback?: Feedback<Employee>;
  employeeLst: { [id: number]: Employee };
  onSubmit: (p: Employee) => void;
  onChange?: (p: Employee) => void;
  onCancel?: () => void;
}

const EmployeeForm: React.FC<IEmployeeFormProps> = (props) => {
  const {
    data,
    feedback,
    employeeLst,
    onSubmit,
    onChange,
    onCancel,
  } = props;
  const newData = { ...data };
  const employees = Object.values(employeeLst);
  const choices: EmployeeFormChoices = {
    gender: {
      choices: [
        { name: "Male", value: "M" },
        { name: "Female", value: "F" },
      ],
      init: data.gender === "M" ? 0 : data.gender === "F" ? 1 : -1,
    },
    reportTo: {
      choices: employees.map((x) => ({ name: x.firstName, value: x.id })),
      init: employees.findIndex((x) => x.id === data.reportTo),
    },
  };

  const handleSubmit = () => {
    onSubmit(newData);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <EmployeeFormFields
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

export default EmployeeForm;
