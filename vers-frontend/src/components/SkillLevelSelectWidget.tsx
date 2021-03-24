import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Skill } from "src/kernel";
import SkillLevelList, { SkillLevel } from "./lists/SkillLevelList";
import MyDialog from "src/components/commons/Dialog";
import SkillSimpleSelForm from "./forms/SkillSimpleSelForm";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
  },
  ctrlButtons: {
    display: "flex",
    flexDirection: "row-reverse",
    marginLeft: "auto",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  title: {
    height: "15%",
  },
  form: {},
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface ISkillLevelSelectWidgetProps {
  lst: { [id: number]: Skill };
  onSubmit: (lst: SkillLevel[]) => void;
}

const SkillLevelSelectWidget: React.FC<ISkillLevelSelectWidgetProps> = (
  props
) => {
  const classes = useStyles();
  const { lst, onSubmit } = props;

  const [addLstOpen, setAddLstOpen] = React.useState(false);
  const [avail, setAvail] = React.useState<Skill[]>([]);
  const [selected, setSelected] = React.useState<SkillLevel[]>([]);
  React.useEffect(() => {
    setAvail(Object.values(lst));
    setSelected([]);
  }, [lst]);

  const setAvailSelected = (skillLvls: SkillLevel[]) => {
    setSelected(skillLvls);
    const nums = new Set(skillLvls.map((x) => x.skill.id));
    setAvail(Object.values(lst).filter((x) => !nums.has(x.id)));
  };

  const handleSubmit = (newLst: SkillLevel[]) => {
    setAvailSelected(newLst);
    onSubmit(newLst);
  };

  const handleAddSkill = (addLst: Skill[]) => {
    setAddLstOpen(false);
    handleSubmit([...selected, ...addLst.map((x) => ({ skill: x, level: 1 }))]);
  };

  const handleAddOnClick = () => {
    setAddLstOpen(true);
  };

  return (
    <React.Fragment>
      <div className={classes.ctrlButtons}>
        <Button
          variant="contained"
          color="primary"
          disabled={avail.length === 0}
          onClick={handleAddOnClick}
        >
          Add
        </Button>
      </div>
      <SkillLevelList lst={selected} onSubmit={handleSubmit} />
      <MyDialog open={addLstOpen} onClose={() => setAddLstOpen(false)}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              className={classes.title}
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Add New Skills
            </Typography>
          </div>
          <div className={classes.formContent}>
            <SkillSimpleSelForm lst={avail} onSubmit={handleAddSkill} />
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export type { SkillLevel };
export default SkillLevelSelectWidget;
