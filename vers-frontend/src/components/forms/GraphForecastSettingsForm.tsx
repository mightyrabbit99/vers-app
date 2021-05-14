import * as React from "react";
import Grid from "@material-ui/core/Grid";
import IntSlider from "src/components/commons/IntSlider";
import MonthRangeSlider from "src/components/commons/MonthRangeSlider";

interface GraphSettings {
  range: Date[];
  offset: number;
}

const defaultSettings: GraphSettings = {
  range: [new Date("2020-01-01"), new Date("2020-12-01")],
  offset: 1,
};

interface IGraphForecastSettingsFormProps {
  data?: GraphSettings;
  months: Date[];
  onChange?: (p: GraphSettings) => void;
}

const GraphForecastSettingsForm: React.FC<IGraphForecastSettingsFormProps> = (
  props
) => {
  const { data, months, onChange } = props;
  const [value, setValue] = React.useState(defaultSettings);
  React.useEffect(() => {
    setValue(data ?? defaultSettings);
  }, [data]);

  const handleChange = (val: any, name: keyof GraphSettings) => {
    onChange
      ? onChange({ ...value, [name]: val })
      : setValue({ ...value, [name]: val });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={2}>
        Month Range:
      </Grid>
      <Grid item xs={10}>
        <MonthRangeSlider
          min={months[0] ?? defaultSettings.range[0]}
          max={months[months.length - 1] ?? defaultSettings.range[1]}
          disabled={months.length < 2}
          value={value.range}
          onChange={(x: any) => handleChange(x, "range")}
        />
      </Grid>
      <Grid item xs={2}>
        Offset Range:
      </Grid>
      <Grid item xs={10}>
        <IntSlider
          min={0}
          max={4}
          value={value.offset}
          onChange={(x: any) => handleChange(x, "offset")}
        />
      </Grid>
    </Grid>
  );
};

export type { GraphSettings };
export default GraphForecastSettingsForm;
