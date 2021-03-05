import * as React from "react";
import TextField from "@material-ui/core/TextField";

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

  const handleForecastChg = (idx: number, p: Forecast) => (
    e: React.ChangeEvent<any>
  ) => {
    let { value } = e.target;
    let newForecasts = [...p.forecasts];
    newForecasts[idx] = { ...newForecasts[idx], val: parseFloat(value) };
    onSubmit({ ...p, forecasts: newForecasts });
  };

  const cols: Col[] = [
    {
      title: "On",
      extractor: (p: Forecast) => p.on,
    },
    {
      title: "n + 1",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[0].val}
          onBlur={handleForecastChg(0, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 2",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[1].val}
          onBlur={handleForecastChg(1, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 3",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[2].val}
          onBlur={handleForecastChg(2, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 4",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[3].val}
          onBlur={handleForecastChg(3, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 5",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[4].val}
          onBlur={handleForecastChg(4, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 6",
      extractor: (p: Forecast) => (
        <TextField
          value={p.forecasts[5].val}
          onBlur={handleForecastChg(5, p)}
          type="number"
        />
      ),
    },
  ];

  return (
    <MainList
      lst={Object.values(lst)}
      cols={cols}
      selected={selected}
      selectedOnChange={selectedOnChange}
    />
  );
};

export default ForecastMainList;
