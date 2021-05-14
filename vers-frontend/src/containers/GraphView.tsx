import * as React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";

import ViewTab, { TabPage } from "src/components/commons/ViewTab";

import GraphForecastWidget from "src/components/GraphForecastWidget";
import { getData } from "src/selectors";
import { Sector, Forecast } from "src/kernel";

interface ISectorForecastGraph {
  sectors: { [id: number]: Sector };
}

const SectorForecastGraph: React.FC<ISectorForecastGraph> = (props) => {
  const { sectors } = props;
  const [sectorTabs, setSectorTabs] = React.useState<number[]>([]);
  const genPages = React.useCallback(
    (): TabPage[] =>
      sectorTabs.map((x) => ({
        name: sectors[x].name,
        node: (
          <GraphForecastWidget
            forecasts={sectors[x].forecasts.reduce((pr, cu) => {
              pr[cu.id] = cu;
              return pr;
            }, {} as { [id: number]: Forecast })}
          />
        ),
      })),
    [sectors, sectorTabs]
  );
  React.useEffect(() => {
    setSectorTabs(
      Object.values(sectors)
        .slice(0, 2)
        .map((x) => x.id)
    );
  }, [sectors]);

  return <ViewTab pages={genPages()} />;
};

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
      <SectorForecastGraph sectors={sectors} />
    </div>
  );
};

export default GraphView;
