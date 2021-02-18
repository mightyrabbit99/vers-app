import * as React from "react";
import { Employee, EmpSkillData, Skill } from "src/kernel";
import SkillLevelCard from "src/components/cards/SkillLevelCard";

interface IEmpSkillListProps {
  item: Employee;
  skillLst: { [id: number]: Skill };
  onSubmit: (e: Employee) => void;
}

const EmpSkillList: React.FunctionComponent<IEmpSkillListProps> = (props) => {
  const { item, skillLst, onSubmit } = props;

  const handleSubmit = (skillIdx: number, empSkill: EmpSkillData) => {
    const newItem = { ...item };
    newItem.skills[skillIdx] = empSkill;
    onSubmit(newItem);
  };

  const handleDelete = (skillIdx: number) => {
    const newSkills = [...item.skills];
    newSkills.splice(skillIdx, 1);
    const newItem = { ...item, skills: newSkills };
    onSubmit(newItem);
  };

  return (
    <div>
      {item.skills.map((x, idx) => (
        <SkillLevelCard
          empSkill={x}
          skill={skillLst[x.skill]}
          level={x.level}
          key={idx}
          onSubmit={(empSkill: EmpSkillData) => handleSubmit(idx, empSkill)}
          onDelete={() => handleDelete(idx)}
        />
      ))}
    </div>
  );
};

export default EmpSkillList;
