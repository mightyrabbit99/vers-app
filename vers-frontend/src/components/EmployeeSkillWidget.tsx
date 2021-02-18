import * as React from "react";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import { Employee, Skill } from "src/kernel";
import EmpSkillList from "./lists/EmpSkillList";

interface IEmployeeSkillWidgetProps {
  lst: { [id: number]: Employee };
  skillLst: { [id: number]: Skill };
  onSubmit: (p: Employee) => void;
}

const EmployeeSkillWidget: React.FunctionComponent<IEmployeeSkillWidgetProps> = (
  props
) => {
  const { lst, skillLst, onSubmit } = props;
  const [sel, setSel] = React.useState<number>(-1);
  const handleListItemClick = (e: React.ChangeEvent<any>, i: number) => {
    setSel(i);
  };

  const genListItem = (emp: Employee, idx: number) => (
    <ListItem
      button
      selected={sel === emp.id}
      onClick={(event) => handleListItemClick(event, emp.id)}
      key={idx}
    >
      <ListItemText primary={`${emp.firstName}`} />
    </ListItem>
  );

  return (
    <Grid container>
      <Grid item xs={3}>
        <List component="nav" aria-label="secondary mailbox folder">
          {Object.values(lst).map(genListItem)}
        </List>
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs={9}>
        <EmpSkillList item={lst[sel]} skillLst={skillLst} onSubmit={onSubmit}/>
      </Grid>
    </Grid>
  );
};

export default EmployeeSkillWidget;
