import * as React from 'react';
import { useSelector } from 'react-redux';
import { getData } from 'src/selectors';

interface IHeadcountViewProps {
}

const HeadcountView: React.FunctionComponent<IHeadcountViewProps> = (props) => {
  const { skills, subsectors, forecasts, calEvents } = useSelector(getData);
  return <div/>;
};

export default HeadcountView;
