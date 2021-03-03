import * as React from "react";
import { Skill } from "src/kernel";

interface SkillLevel {
  skill: number;
  level: number;
}

interface ISkillLevelSearchBarProps {
  lst: { [id: number]: Skill };
  onSubmit: (lst: SkillLevel[]) => void;
}

const SkillLevelSearchBar: React.FunctionComponent<ISkillLevelSearchBarProps> = (
  props
) => {
  const { lst, onSubmit } = props;
  const values = Object.values(lst).flatMap((x) =>
    [1, 2, 3, 4].map((y) => ({ name: x.name, level: y }))
  );
  return <div />;
};

export type { SkillLevel };
export default SkillLevelSearchBar;
