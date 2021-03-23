import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { User } from "src/kernel";
import UserAccessCtrlList from "./lists/EmpAccessCtrlList";

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
  lst: { [id: number]: User };
  onSubmit?: (p: User) => void;
  editSuper?: boolean;
}

const EmpAccessCtrl: React.FunctionComponent<IEmpAccessCtrlProps> = (props) => {
  const classes = useStyles();
  const { lst, onSubmit, editSuper = false } = props;
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
          User Access Control
        </Typography>
      </div>
      <UserAccessCtrlList lst={lst} onSubmit={onSubmit} editSuper={editSuper} />
    </React.Fragment>
  );
};

export default EmpAccessCtrl;
