import * as React from "react";
import { useSelector } from "react-redux";
import HeadcountListWidget from "src/components/HeadcountListWidget";
import { getData } from "src/selectors";

interface IHeadcountViewProps {}

const HeadcountView: React.FunctionComponent<IHeadcountViewProps> = (props) => {
  const { skills, subsectors, forecasts, calEvents } = useSelector(getData);
  return (
    <HeadcountListWidget
      skills={skills}
      subsectors={subsectors}
      forecasts={forecasts}
      calEvents={calEvents}
    />
  );
};

export default HeadcountView;
