import * as React from "react";
import { Line } from "react-chartjs-2";
import { Forecast } from "src/kernel";

interface IForecastActualGProps {
  title?: string;
  forecasts: { [id: number]: Forecast };
  offsets?: number[];
  months: Date[];
}

const colors = [
  "rgb(255, 99, 132)",
  "rgb(75, 192, 192)",
  "rgba(117, 210, 50, 1)",
];

const ForecastActualG: React.FunctionComponent<IForecastActualGProps> = (
  props
) => {
  const { title, forecasts, months, offsets = [1, 2, 3] } = props;

  const genData = (months: Date[], forecasts: Forecast[]) => {
    let data = Object.values(forecasts).reduce((pr, cu) => {
      let d = new Date(cu.on);
      for (let fo of cu.forecasts) {
        let dd = new Date(d);
        dd.setMonth(d.getMonth() + fo.n);
        let dStr = dd.toISOString().slice(0, 10);
        if (!(dStr in pr)) pr[dStr] = {};
        pr[dStr][fo.n] = fo.val;
      }
      return pr;
    }, {} as { [month: string]: { [n: number]: any } });
    const getData = (month: Date, i: number) => {
      let m = month.toISOString().slice(0, 10);
      return m in data && i in data[m] ? data[m][i] : undefined;
    };
    let offs = [...offsets].sort();
    return {
      labels: months.map((x) => x.toISOString().slice(0, 7)),
      datasets: [
        {
          type: "line",
          label: "Actual",
          borderColor: "rgb(54, 162, 235)",
          borderWidth: 2,
          fill: false,
          data: months.map((x) => getData(x, 0) ?? 0),
        },
        ...offs.map((off, idx) => ({
          type: "bar",
          label: `n - ${off}`,
          backgroundColor: colors[idx],
          data: months.map((x) => getData(x, off)),
          borderColor: "white",
          borderWidth: 0,
        })),
      ],
    };
  };

  return (
    <Line
      type=""
      data={genData(months, Object.values(forecasts))}
      options={{
        title: {
          display: !!title,
          text: title ?? "",
          fontSize: 20,
        },
        legend: {
          display: true,
          position: "right",
        },
      }}
    />
  );
};

export default ForecastActualG;
