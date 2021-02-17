import * as React from "react";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { Employee } from "src/kernel";
import Divider from "@material-ui/core/Divider";

interface IEmployeeSkillWidgetProps {
  lst: { [id: number]: Employee };
  onSubmit: (p: Employee) => void;
}

const EmployeeSkillWidget: React.FunctionComponent<IEmployeeSkillWidgetProps> = (
  props
) => {
  const { lst, onSubmit } = props;
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
    </Grid>
  );
};

export default EmployeeSkillWidget;
