import * as React from "react";
import { Skill } from "src/kernel";

import Checklist, { Item } from "../commons/Checklist";

interface FormProps {
  lst: Skill[];
  onSubmit: (lst: Skill[]) => void;
}

const Form: React.FC<FormProps> = (props) => {
  const { lst, onSubmit } = props;

  const itemLst: Item<Skill>[] = lst.map((x) => ({ name: x.name, value: x }));
  return <Checklist lst={itemLst} onSubmit={onSubmit} />;
};

export default Form;
