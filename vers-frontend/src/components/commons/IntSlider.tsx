import * as React from "react";
import _ from "lodash";
import Slider from "@material-ui/core/Slider";

interface IIntSliderProps {
  min: number;
  max: number;
  value?: number | number[];
  valuetext?: (i: number) => string;
  onChange?: (val: number | number[]) => any;
}

const IntSlider: React.FC<IIntSliderProps> = (props) => {
  const { min, max, value: val, onChange, valuetext } = props;
  const [value, setValue] = React.useState<number | number[]>(0);
  React.useEffect(() => {
    if (val === undefined) return;
    let withinRange = (x: number) => x >= min && x <= max;
    if (Array.isArray(val)) {
      if (val.length > 1 && val.slice(0, 2).every(withinRange)) {
        setValue([Math.min(...val), Math.max(...val)]);
      } else {
        setValue([min, max]);
      }
    } else {
      if (withinRange(val)) {
        setValue(val);
      } else {
        setValue(min);
      }
    }
  }, [val, min, max]);

  const handleChange = (event: any, newValue: number | number[]) => {
    if (_.isEqual(newValue, value)) return;
    onChange ? onChange(newValue) : setValue(newValue);
  };

  return (
    <Slider
      value={value}
      onChange={handleChange}
      valueLabelDisplay="auto"
      getAriaValueText={valuetext}
      valueLabelFormat={valuetext}
      aria-labelledby="discrange-slider"
      min={min}
      step={1}
      max={max}
    />
  );
};

export default IntSlider;
