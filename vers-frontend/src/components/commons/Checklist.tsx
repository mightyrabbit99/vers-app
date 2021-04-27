import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import { toRegExp } from "src/utils/tools";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  searchBar: {
    height: "10%",
    width: "100%",
  },
  list: {
    height: "80%",
    width: "100%",
    overflowY: "scroll",
  },
  ctrlButtons: {
    height: "10%",
    width: "100%",
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
  const { lst: l, onSubmit } = props;

  const [lst, setLst] = React.useState(l);
  const [searchTerm, setSearchTerm] = React.useState("");
  React.useEffect(() => {
    if (searchTerm === "") {
      setLst(l);
    } else {
      const reg = toRegExp(searchTerm);
      setLst(l.filter((x) => reg.test(x.name)));
    }
  }, [l, searchTerm]);

  const handleSearchBarChange = (e: React.ChangeEvent<any>) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const [selected, setSelected] = React.useState<Set<Item<T>>>(new Set());
  React.useEffect(() => {
    setSelected(new Set());
  }, [l]);

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
    onSubmit([...selected].map((x) => x.value));
  };

  return (
    <div className={classes.root}>
      <div className={classes.searchBar}>
        <TextField
          className={classes.searchBar}
          label="Search"
          type="search"
          fullWidth
          onChange={handleSearchBarChange}
        />
      </div>
      <div className={classes.list}>
        <List dense>
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
      </div>
      <div className={classes.ctrlButtons}>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}

export type { Item };
export default Form;
