import * as React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import ViewTab, { TabPage } from "src/components/commons/ViewTab";

import GraphForecastWidget from "src/components/GraphForecastWidget";
import { getData } from "src/selectors";

const useStyles = makeStyles((theme) => ({
  page: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    height: "85vh",
  },
}));

interface IGraphViewProps {}

const GraphView: React.FC<IGraphViewProps> = (props) => {
  const classes = useStyles();
  const { forecasts } = useSelector(getData);

  const pages: TabPage[] = [
    {
      name: "Forecasts",
      node: (
        <div className={classes.page}>
          <GraphForecastWidget forecasts={forecasts} />
        </div>
      ),
    },
  ];

  return <ViewTab pages={pages} />;
};

export default GraphView;
