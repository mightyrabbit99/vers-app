import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "inherit",
  },
}));

interface Item<T> {
  name: string;
  value: T;
}

interface FormProps<T> {
  lst: Item<T>[];
  onSubmit: (lst: T[]) => void;
}

function Form<T>(props: FormProps<T>) {
  const classes = useStyles();
  const { lst, onSubmit } = props;

  const [selected, setSelected] = React.useState<Set<Item<T>>>(new Set());
  const handleSel = (e: Item<T>) => {
    let newSelected = new Set(selected);
    if (selected.has(e)) {
      newSelected.delete(e);
    } else {
      newSelected.add(e);
    }
    setSelected(newSelected);
  };

  const handleSubmit = () => {
    onSubmit([...selected].map(x => x.value));
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12}>
          <List dense className={classes.root}>
            {lst.map((x, idx) => {
              const labelId = `checkbox-list-secondary-label-${idx}`;
              return (
                <ListItem key={idx} button>
                  <ListItemText id={labelId} primary={x.name} />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      onChange={() => handleSel(x)}
                      checked={selected.has(x)}
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={12}>
        <Button onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export type { Item };
export default Form;
