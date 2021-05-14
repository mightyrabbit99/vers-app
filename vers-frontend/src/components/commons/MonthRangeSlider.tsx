import * as React from "react";
import IntSlider from "./IntSlider";

const mDiff = (a: Date, b: Date) =>
  12 * (b.getFullYear() - a.getFullYear()) + b.getMonth() - a.getMonth();

const getMonths = (min: Date, max: Date) => {
  let ms = mDiff(min, max) + 1;
  return [...new Array(ms).keys()].map((x) => {
    let d = new Date(min);
    d.setMonth(d.getMonth() + x);
    return d;
  });
};

interface IMonthRangeSliderProps {
  min: Date;
  max: Date;
  value?: Date[];
  disabled?: boolean;
  onChange?: (val: Date[]) => any;
}

const MonthRangeSlider: React.FC<IMonthRangeSliderProps> = (props) => {
  const { min, max, value: val, onChange, disabled } = props;
  const [months, setMonths] = React.useState<Date[]>([]);
  React.useEffect(() => {
    setMonths(getMonths(min, max));
  }, [min, max]);
  const [value, setValue] = React.useState<number[]>([0, 0]);
  React.useEffect(() => {
    let withinRange = (x: Date) => {
      return (
        months.length < 2 ||
        (months[0].getTime() <= x.getTime() &&
          x.getTime() <= months[months.length - 1].getTime())
      );
    };
    if (val && val.length > 1 && val.every(withinRange)) {
      let arr = [
        months.findIndex((x) => x.getTime() >= val[0].getTime()),
        months.findIndex((x) => x.getTime() >= val[1].getTime()),
      ];
      setValue([Math.min(...arr), Math.max(...arr)]);
    } else {
      setValue([0, months.length - 1]);
    }
  }, [val, months]);

  const handleChange = (newValue: number | number[]) => {
    let v = newValue as number[];
    onChange ? onChange(v.slice(0, 2).map((x) => months[x])) : setValue(v);
  };

  const valuetext = (i: number) => {
    if (i < 0 || i >= months.length) return "";
    return months[i].toLocaleDateString("default", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <IntSlider
      value={value}
      onChange={handleChange}
      valuetext={valuetext}
      disabled={disabled}
      min={0}
      max={months.length - 1}
    />
  );
};

export default MonthRangeSlider;
