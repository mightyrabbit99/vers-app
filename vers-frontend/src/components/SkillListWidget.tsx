import * as React from 'react';
import { Skill, Subsector } from 'src/kernel';

interface ISkillListWidgetProps {
  lst: { [id: number]: Skill};
  subsectorLst: { [id: number]: Subsector};
  newSkill?: Skill;
  onSubmit: (s: Skill) => void;
  onDelete: (s: Skill) => void;
  onReset: () => void;
}

const SkillListWidget: React.FunctionComponent<ISkillListWidgetProps> = (props) => {
  return <div/>;
};

export default SkillListWidget;
