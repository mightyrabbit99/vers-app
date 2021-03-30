import * as React from "react";

import { Grid, Button } from "@material-ui/core";
import { Employee, Subsector } from "src/kernel";
import EmployeeFormFields, { EmployeeFormChoices } from "./EmployeeFormFields";

interface IEmployeeFormProps {
  data: Employee;
  feedback?: any;
  employeeLst: { [id: number]: Employee };
  subsectorLst: { [id: number]: Subsector };
  onSubmit: (p: Employee) => void;
  onChange?: (p: Employee) => void;
  onCancel?: () => void;
}

const EmployeeForm: React.FC<IEmployeeFormProps> = (props) => {
  const {
    data,
    feedback,
    subsectorLst,
    employeeLst,
    onSubmit,
    onChange,
    onCancel,
  } = props;
  const newData = { ...data };
  const employees = Object.values(employeeLst);
  const subsectors = Object.values(subsectorLst);
  const choices: EmployeeFormChoices = {
    gender: {
      choices: [
        { name: "Male", value: "M" },
        { name: "Female", value: "F" },
      ],
      init: data.gender === "M" ? 0 : data.gender === "F" ? 1 : -1,
    },
    subsector: {
      choices: subsectors.map((x) => ({ name: x.name, value: x.id })),
      init: subsectors.findIndex((x) => x.id === data.subsector),
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
