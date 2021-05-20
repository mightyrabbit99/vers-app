import * as React from "react";
import _ from "lodash";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { Forecast, Sector } from "src/kernel";
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
  settingsContainer: {
    display: "flex",
    flexDirection: "row",
    height: "10%",
    minHeight: 50,
    width: "100%",
    position: "relative",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  settingsIcon: {
    marginLeft: "auto",
  },
  graph: {
    height: "90%",
    minHeight: 250,
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
  sectors: { [id: number]: Sector };
}

const GraphForecastWidget: React.FC<IGraphForecastWidgetProps> = (props) => {
  const classes = useStyles();
  const { sectors } = props;

  const [selSectorId, setSelSectorId] = React.useState<number>();
  React.useEffect(() => {
    setSelSectorId((id) => {
      if (id !== undefined && id in sectors) return id;
      let kLst = Object.keys(sectors);
      if (kLst.length > 0) return parseInt(kLst[0]);
      if (id !== undefined) setSelSectorId(undefined);
    });
  }, [sectors]);

  const handleSelSector = (e: React.ChangeEvent<any>) => {
    let { value: newId } = e.target;
    if (newId === undefined || newId === selSectorId) return;
    setSelSectorId(newId);
  };

  const [forecasts, setForecasts] = React.useState<{ [id: number]: Forecast }>(
    {}
  );
  React.useEffect(() => {
    if (selSectorId === undefined) return;
    let s = sectors[selSectorId];
    setForecasts(
      s.forecasts.reduce((pr, cu) => {
        pr[cu.id] = cu;
        return pr;
      }, {} as { [id: number]: Forecast })
    );
  }, [sectors, selSectorId]);

  const [months, setMonths] = React.useState<Date[]>([]);
  React.useEffect(() => {
    setMonths(getForecastMonths(Object.values(forecasts)));
  }, [forecasts]);

  const [formOpen, setFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<GraphSettings>({
    range: [new Date("2020-01-01"), new Date("2020-12-01")],
    offset: 1,
  });
  React.useEffect(() => {
    setFormData((fD) => {
      if (months.length > 0) {
        let mLst = months.slice(0, 5);
        return { ...fD, range: [mLst[0], mLst[mLst.length - 1]] };
      }
      return { ...fD, range: [new Date("2020-01-01"), new Date("2020-12-01")] };
    });
  }, [months]);

  const handleChange = (data: GraphSettings) => {
    setFormData(data);
  };

  return (
    <React.Fragment>
      <div className={classes.settingsContainer}>
        {/*<Typography
          className={classes.title}
          component="h2"
          variant="h6"
          color="primary"
        >
          Forecasts
        </Typography>*/}
        <FormControl>
          <InputLabel id="demo-simple-select-label">Sector</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={selSectorId ?? ""}
            disabled={_.isEmpty(sectors)}
            onClick={handleSelSector}
          >
            {Object.values(sectors).map((x, idx) => (
              <MenuItem key={idx} value={x.id}>
                {x.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
          months={getMonths(formData.range[0], formData.range[1])}
          offsets={[...new Array(formData.offset).keys()].map((x) => x + 1)}
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
    </React.Fragment>
  );
};

export default GraphForecastWidget;
