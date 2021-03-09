import * as React from "react";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import ReplayIcon from "@material-ui/icons/Replay";
import { Forecast } from "src/kernel";
import MainList, { Col } from "./MainList";

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
    setStateLst({
      ...stateLst,
      ...Object.fromEntries(
        Object.entries(lst).filter(([x, y]) =>
          y.id in noChgLst ? noChgLst[y.id] : true
        )
      ),
    });
    setNoChgLst(
      Object.fromEntries(
        Object.values(lst).map((x) => [x.id, noChgLst[x.id] ?? true])
      )
    );
  }, [lst]);

  const handleForecastRealChg = (n: number, p: Forecast) => (
    e: React.ChangeEvent<any>
  ) => {
    let { value } = e.target;
    let i = p.forecasts.findIndex((x) => x.n === n);
    let newForecasts = [...p.forecasts];
    if (i === -1) {
      newForecasts.push({ id: -1, n, val: value });
    } else {
      newForecasts[i] = {
        ...newForecasts[i],
        n,
        val: value === "" ? 0.0 : parseFloat(value),
      };
    }
    setStateLst({ ...stateLst, [p.id]: { ...p, forecasts: newForecasts } });
  };

  const handleForecastChg = (n: number, p: Forecast) => (
    e: React.ChangeEvent<any>
  ) => {
    let { value } = e.target;
    let i = p.forecasts.findIndex((x) => x.n === n);
    let newForecasts = [...p.forecasts];
    if (i === -1) {
      newForecasts.push({ id: -1, n, val: value });
    } else {
      newForecasts[i] = {
        ...newForecasts[i],
        n,
        val: value,
      };
    }
    setStateLst({ ...stateLst, [p.id]: { ...p, forecasts: newForecasts } });
    setNoChgLst({ ...noChgLst, [p.id]: false });
  };

  const handleForecastSubmit = (p: Forecast) => () => {
    setNoChgLst({ ...noChgLst, [p.id]: true });
    onSubmit(p);
  };

  const handleForecastReset = (p: Forecast) => () => {
    setStateLst({ ...stateLst, [p.id]: lst[p.id] });
    setNoChgLst({ ...noChgLst, [p.id]: true });
  };

  const getForecastVal = (n: number, p: Forecast) => {
    let i = p.forecasts.findIndex((x) => x.n === n);
    return i === -1 ? "" : p.forecasts[i].val;
  }

  const cols: Col[] = [
    {
      title: "On",
      extractor: (p: Forecast) => {
        let d = new Date(Date.parse(p.on));
        return `${d.getFullYear()} - ${d.getMonth() + 1}`;
      },
    },
    {
      title: "n + 1",
      extractor: (p: Forecast) => (
        <TextField
          value={getForecastVal(0, p)}
          onChange={handleForecastChg(0, p)}
          onBlur={handleForecastRealChg(0, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 2",
      extractor: (p: Forecast) => (
        <TextField
          value={getForecastVal(1, p)}
          onChange={handleForecastChg(1, p)}
          onBlur={handleForecastRealChg(1, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 3",
      extractor: (p: Forecast) => (
        <TextField
          value={getForecastVal(2, p)}
          onChange={handleForecastChg(2, p)}
          onBlur={handleForecastRealChg(2, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 4",
      extractor: (p: Forecast) => (
        <TextField
          value={getForecastVal(3, p)}
          onChange={handleForecastChg(3, p)}
          onBlur={handleForecastRealChg(3, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 5",
      extractor: (p: Forecast) => (
        <TextField
          value={getForecastVal(4, p)}
          onChange={handleForecastChg(4, p)}
          onBlur={handleForecastRealChg(4, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 6",
      extractor: (p: Forecast) => (
        <TextField
          value={getForecastVal(5, p)}
          onChange={handleForecastChg(5, p)}
          onBlur={handleForecastRealChg(5, p)}
          type="number"
        />
      ),
    },
    {
      extractor: (p: Forecast) => (
        <IconButton
          disabled={noChgLst[p.id]}
          onClick={handleForecastReset(p)}
          color="primary"
        >
          <ReplayIcon />
        </IconButton>
      ),
    },
    {
      extractor: (p: Forecast) => (
        <IconButton
          disabled={noChgLst[p.id]}
          onClick={handleForecastSubmit(p)}
          color="primary"
        >
          <SaveIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <MainList
      lst={Object.values(stateLst).sort(
        (a, b) => Date.parse(a.on) - Date.parse(b.on)
      )}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
    />
  );
};

export default ForecastMainList;
