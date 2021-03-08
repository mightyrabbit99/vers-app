import * as React from "react";
import TextField from "@material-ui/core/TextField";

import { Forecast } from "src/kernel";
import MainList, { Col } from "./MainList";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";

interface IForecastMainListProps {
  lst: { [id: number]: Forecast };
  onSubmit: (f: Forecast) => void;
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
}

const ForecastMainList: React.FunctionComponent<IForecastMainListProps> = (
  props
) => {
  const { lst, onSubmit, selected, selectedOnChange } = props;

  const [stateLst, setStateLst] = React.useState(lst);
  const [noChgLst, setNoChgLst] = React.useState<{ [id: number]: boolean }>({});
  React.useEffect(() => {
    setStateLst(lst);
    setNoChgLst(Object.fromEntries(Object.keys(lst).map(x => [x, true])));
  }, [lst]);

  const handleForecastChg = (idx: number, p: Forecast) => (
    e: React.ChangeEvent<any>
  ) => {
    let { value } = e.target;
    let newForecasts = [...p.forecasts];
    newForecasts[idx] = { ...newForecasts[idx], n: idx, val: parseFloat(value) };
    setStateLst({ ...stateLst, [p.id]: { ...p, forecasts: newForecasts }});
    setNoChgLst({ ...noChgLst, [p.id]: false });
  };

  const handleForecastSubmit = (p: Forecast) => () => {
    onSubmit(p);
  }

  const cols: Col[] = [
    {
      title: "On",
      extractor: (p: Forecast) => {
        let d = new Date(Date.parse(p.on));
        return `${d.getFullYear()} - ${d.getUTCMonth()}`;
      }
    },
    {
      title: "n + 1",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[0]?.val ?? ""}
          onChange={handleForecastChg(0, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 2",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[1]?.val ?? ""}
          onChange={handleForecastChg(1, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 3",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[2]?.val ?? ""}
          onChange={handleForecastChg(2, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 4",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[3]?.val ?? ""}
          onChange={handleForecastChg(3, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 5",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[4]?.val ?? ""}
          onChange={handleForecastChg(4, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 6",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[5]?.val ?? ""}
          onChange={handleForecastChg(5, p)}
          type="number"
        />
      ),
    },
    {
      extractor: (p: Forecast) => (
        <IconButton disabled={noChgLst[p.id]} onClick={handleForecastSubmit(p)} color="primary">
          <SaveIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <MainList
      lst={Object.values(stateLst)}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
    />
  );
};

export default ForecastMainList;
