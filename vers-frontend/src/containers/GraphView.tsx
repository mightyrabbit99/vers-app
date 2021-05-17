import * as React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import GraphForecastWidget from "src/components/GraphForecastWidget2";
import { getData } from "src/selectors";

const useStyles = makeStyles((theme) => ({
  page: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    height: "85vh",
    width: "100%",
  },
}));

const GraphView: React.FC = () => {
  const classes = useStyles();
  const { sectors } = useSelector(getData);

  return (
    <div className={classes.page}>
      <GraphForecastWidget sectors={sectors} />
    </div>
  );
};

export default GraphView;
