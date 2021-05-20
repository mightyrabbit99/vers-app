import * as React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import GraphForecastWidget from "src/components/GraphForecastWidget2";
import GraphHeadcountWidget from "src/components/GraphHeadcountWidget";
import ViewTab, { TabPage } from "src/components/commons/ViewTab";
import { getData } from "src/selectors";

const useStyles = makeStyles((theme) => ({
  page: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    minHeight: 500,
    height: "85vh",
    width: "100%",
  },
  tabPage: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "hide",
    flexDirection: "column",
    minHeight: 400,
    height: "80vh",
    width: "100%",
  },
}));

const GraphView: React.FC = () => {
  const classes = useStyles();
  const { sectors, subsectors, skills, calEvents } = useSelector(getData);

  const genPages = (): TabPage[] => [
    {
      name: "Forecast",
      node: (
        <div className={classes.tabPage}>
          <GraphForecastWidget sectors={sectors} />
        </div>
      ),
    },
    {
      name: "Headcount",
      node: (
        <div className={classes.tabPage}>
          <GraphHeadcountWidget
            skills={skills}
            subsectors={subsectors}
            sectors={sectors}
            calEvents={calEvents}
          />
        </div>
      ),
    },
  ];

  return <ViewTab pages={genPages()} />;
};

export default GraphView;
