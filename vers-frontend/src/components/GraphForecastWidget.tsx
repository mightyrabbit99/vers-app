import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import Typography from "@material-ui/core/Typography";

import { Forecast } from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import ForecastActualG from "./graphs/ForecastActualGraph";
import GraphForecastSettingsForm, {
  GraphSettings,
} from "./forms/GraphForecastSettingsForm";

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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
  settingsContainer: {
    height: "10%",
    width: "100%",
    position: "relative",
  },
  settingsIcon: {
    marginLeft: "auto",
  },
  graph: {
    height: "90%",
    width: "100%",
  },
  form: {
    width: 700,
    minWidth: 600,
  },
  formTitle: {
    height: "15%",
  },
  title: {
    height: "15%",
  },
  formContent: {
    height: "85%",
    paddingTop: 20,
  },
}));

const getForecastMonths = (fs: Forecast[]) => {
  const months = fs.flatMap((x) => {
    let d = new Date(x.on);
    return x.forecasts.map((y) => {
      let dd = new Date(d);
      dd.setMonth(dd.getMonth() + y.n);
      return dd;
    });
  });
  const cleanedMonth = [
    ...new Set(months.map((x) => x.toISOString().slice(0, 7))),
  ].map((x) => new Date(x));
  return cleanedMonth.sort((a: Date, b: Date) =>
    a < b ? -1 : a === b ? 0 : 1
  );
};

interface IGraphForecastWidgetProps {
  forecasts: { [id: number]: Forecast };
}

const GraphForecastWidget: React.FC<IGraphForecastWidgetProps> = (props) => {
  const classes = useStyles();
  const { forecasts } = props;

  const [months, setMonths] = React.useState<Date[]>([]);
  React.useEffect(() => {
    setMonths(getForecastMonths(Object.values(forecasts)));
  }, [forecasts]);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<GraphSettings>({
    range: [new Date("2020-01-01"), new Date("2020-12-01")],
    offset: 1,
  });

  const handleChange = (data: GraphSettings) => {
    setFormData(data);
  };

  return (
    <div className={classes.root}>
      <div className={classes.settingsContainer}>
        <IconButton
          className={classes.settingsIcon}
          onClick={() => setFormOpen(true)}
        >
          <SettingsIcon />
        </IconButton>
      </div>
      <div className={classes.graph}>
        <ForecastActualG
          forecasts={forecasts}
          months={
            formData ? getMonths(formData.range[0], formData.range[1]) : months
          }
          offsets={
            formData
              ? [...new Array(formData.offset).keys()].map((x) => x + 1)
              : undefined
          }
          title="Forecasts"
        />
      </div>
      <MyDialog open={formOpen} onClose={() => setFormOpen(false)}>
        <div className={classes.form}>
          <div className={classes.formTitle}>
            <Typography
              className={classes.title}
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Edit Settings
            </Typography>
          </div>
          <div className={classes.formContent}>
            <GraphForecastSettingsForm
              data={formData}
              months={months}
              onChange={handleChange}
            />
          </div>
        </div>
      </MyDialog>
    </div>
  );
};

export default GraphForecastWidget;
