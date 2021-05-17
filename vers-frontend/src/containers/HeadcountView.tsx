import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import HeadcountListWidget from "src/components/HeadcountListWidget2";
import { getData } from "src/selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80vh",
    minHeight: 430,
  },
}));

interface IHeadcountViewProps {}

const HeadcountView: React.FC<IHeadcountViewProps> = (props) => {
  const classes = useStyles();
  const { sectors, subsectors, skills, calEvents, employees } = useSelector(
    getData
  );
  return (
    <div className={classes.root}>
      <HeadcountListWidget
        skills={skills}
        subsectors={subsectors}
        sectors={sectors}
        calEvents={calEvents}
        employees={employees}
      />
    </div>
  );
};

export default HeadcountView;
