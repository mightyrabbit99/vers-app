import * as React from "react";
import { useSelector } from "react-redux";
import ForecastActualG from "src/components/graphs/ForecastActualGraph";
import { getData } from "src/selectors";

interface IGraphViewProps {}

const GraphView: React.FunctionComponent<IGraphViewProps> = (props) => {
  const { forecasts } = useSelector(getData);

  const getMonths = () => {
    const months = Object.values(forecasts).map((x) => new Date(x.on));
    months.sort((a: Date, b: Date) => a < b ? -1 : a === b ? 0 : 1);
    const defMonth = [1, 2, 3].map((x) => {
      let t = new Date();
      t.setMonth(t.getMonth() - x);
      return t;
    });
    return months.length >= 3 ? months.slice(-6, -1) : defMonth;
  };

  return <ForecastActualG forecasts={forecasts} months={getMonths()} title="Forecasts" />;
};

export default GraphView;
