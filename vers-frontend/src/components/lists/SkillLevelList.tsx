import * as React from "react";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import DeleteIcon from "@material-ui/icons/DeleteForever";

import { Skill } from "src/kernel";

interface SkillLevel {
  skill: Skill;
  level: number;
}

interface ISkillLevelListProps {
  lst: SkillLevel[];
  onSubmit: (lst: SkillLevel[]) => void;
}

const SkillLevelList: React.FunctionComponent<ISkillLevelListProps> = (
  props
) => {
  const { lst, onSubmit } = props;

  const genSkillCard = (s: SkillLevel, idx: number) => {
    const handleChange = (e: React.ChangeEvent<any>) => {
      const { value } = e.target;
      lst[idx].level = value;
      onSubmit([...lst]);
    }

    const handleDelete = () => {
      let newLst = [...lst];
      newLst.splice(idx, 1)
      onSubmit(newLst);
    }

    return (
      <ListItem key={idx}>
        <ListItemText
          primary={s.skill.name}
        />
        <ListItemSecondaryAction>
          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="level"
              value={s.level}
              disabled={!onSubmit}
              onChange={handleChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
          <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return <List dense>{lst.map(genSkillCard)}</List>;
};

export type { SkillLevel };
export default SkillLevelList;
