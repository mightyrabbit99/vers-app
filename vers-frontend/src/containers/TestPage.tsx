import * as React from "react";
import { useSelector } from "react-redux";
import { getData } from "src/selectors";
import EmployeeList from "src/components/lists/EmployeeMainList";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    height: 300,
  }
}));

const TestPage: React.FC = () => {
  const classes = useStyles();
  const { employees } = useSelector(getData);
  const [selected, setSelected] = React.useState<number[]>([]);
  return (
    <div className={classes.root}>
      <EmployeeList
        lst={employees}
        selected={selected}
        selectedOnChange={setSelected}
      />
    </div>
  );
};

export default TestPage;
