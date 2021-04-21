import * as React from "react";
import { useSelector } from "react-redux";
import { getData } from "src/selectors";
import SkillSimpleSelForm from "src/components/forms/SkillSimpleSelForm";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    height: 300,
  }
}));

const TestPage: React.FC = () => {
  const classes = useStyles();
  const { skills } = useSelector(getData);
  const [selected, setSelected] = React.useState<number[]>([]);
  return (
    <div className={classes.root}>
      <SkillSimpleSelForm lst={Object.values(skills)} onSubmit={() => {}}/>
    </div>
  );
};

export default TestPage;
