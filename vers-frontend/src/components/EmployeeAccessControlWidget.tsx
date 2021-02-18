import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Employee } from "src/kernel";
import EmployeeAccessCtrlList from "./lists/EmpAccessCtrlList";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    height: "15%",
  },
}));

interface IEmpAccessCtrlProps {
  lst: { [id: number]: Employee };
  onSubmit: (p: Employee) => void;
}

const EmpAccessCtrl: React.FunctionComponent<IEmpAccessCtrlProps> = (props) => {
  const classes = useStyles();
  const { lst, onSubmit } = props;
  return (
    <React.Fragment>
      <div className={classes.header}>
        <Typography
          className={classes.title}
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
        >
          Employee Access Control
        </Typography>
      </div>
      <EmployeeAccessCtrlList lst={lst} onSubmit={onSubmit} />
    </React.Fragment>
  );
};

export default EmpAccessCtrl;
