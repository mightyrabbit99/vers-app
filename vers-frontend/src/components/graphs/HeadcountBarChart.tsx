import * as React from "react";
import { Subsector } from "src/kernel";

interface IHeadcountBarChartProps {
  subsectors: { [id: number]: Subsector };
  countDict: { [subsecId: number]: number };
}

const HeadcountBarChart: React.FC<IHeadcountBarChartProps> = (props) => {
  return <div />;
};

export default HeadcountBarChart;
