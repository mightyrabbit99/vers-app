import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import createMuiTheme, {
  ThemeOptions,
} from "@material-ui/core/styles/createMuiTheme";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import ReplayIcon from "@material-ui/icons/Replay";
import { Forecast } from "src/kernel";
import MainList, { Col } from "./MainList";
import { ThemeProvider } from "@material-ui/styles";

const themeOptions: ThemeOptions = {
  palette: {
    type: "light",
    primary: {
      main: "#3f51b5",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    body2: {
      fontSize: "0.6rem",
    },
    body1: {
      fontSize: "0.7rem",
    },
  },
  spacing: 1,
};

const theme = createMuiTheme(themeOptions);

const useStyles = makeStyles((theme) => ({
  field: {
    paddingLeft: 2,
    paddingRight: 2,
  },
}));

type FL = { [id: number]: Forecast };

interface IForecastMainListProps {
  lst: FL;
  onSubmit: (f: Forecast) => void;
  selected?: number[];
  selectedOnChange?: (ids: number[]) => void;
}

interface IForecastMainListState {
  stateLst: FL;
  chgLst: number[];
}

const initState: IForecastMainListState = {
  stateLst: {},
  chgLst: [],
};

const ForecastMainList: React.FC<IForecastMainListProps> = (props) => {
  const classes = useStyles(props);
  const { lst, onSubmit, selected, selectedOnChange } = props;

  const [state, setState] = React.useState<IForecastMainListState>(initState);
  const { chgLst, stateLst } = state;
  const setChgLst = (lst: number[]) =>
    setState({
      ...state,
      chgLst: lst,
    });

  React.useEffect(
    () =>
      setState((state) => ({
        chgLst: state.chgLst.filter((x) => x in lst),
        stateLst: Object.fromEntries(
          Object.entries(lst).filter(([x, y]) => !state.chgLst.includes(y.id))
        ),
      })),
    [lst]
  );

  const handleForecastChg = (n: number, p: Forecast) => (
    e: React.ChangeEvent<any>
  ) => {
    let { value } = e.target;
    let i = p.forecasts.findIndex((x) => x.n === n);
    let floatVal = parseFloat(value);
    let noChg = isNaN(floatVal) && floatVal === p.forecasts[i].val;
    if (noChg) return;
    let newForecasts = [...p.forecasts];
    if (i === -1) {
      newForecasts.push({ n, val: value });
    } else {
      newForecasts[i] = {
        ...newForecasts[i],
        n,
        val: value,
      };
    }
    setState({
      stateLst: {
        ...stateLst,
        [p.id]: {
          ...p,
          forecasts: newForecasts,
        },
      },
      chgLst: chgLst.includes(p.id) ? chgLst : [...chgLst, p.id],
    });
  };

  const handleForecastRealChg = (n: number, p: Forecast) => (
    e: React.ChangeEvent<any>
  ) => {
    let { value } = e.target;
    e.target.value = value === "" ? 0.0 : parseFloat(value);
    handleForecastChg(n, p)(e);
  };

  const handleForecastSubmit = (p: Forecast) => () => {
    setChgLst([...chgLst.filter((x) => x !== p.id)]);
    onSubmit(p);
  };

  const handleForecastReset = (p: Forecast) => () => {
    setState({
      chgLst: [...chgLst.filter((x) => x !== p.id)],
      stateLst: { ...stateLst, [p.id]: lst[p.id] },
    });
  };

  const getForecastVal = (n: number, p: Forecast) => {
    let i = p.forecasts.findIndex((x) => x.n === n);
    return i === -1 ? "" : p.forecasts[i].val;
  };

  const ctrlDisabled = (p: Forecast) => {
    return !chgLst.includes(p.id);
  };

  const cols: Col[] = [
    {
      title: "On",
      extractor: (p: Forecast) => {
        let d = new Date(Date.parse(p.on));
        return `${d.getFullYear()} - ${d.getMonth() + 1}`;
      },
    },
    {
      title: "n + 1",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(0, p)}
          onChange={handleForecastChg(0, p)}
          onBlur={handleForecastRealChg(0, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 2",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(1, p)}
          onChange={handleForecastChg(1, p)}
          onBlur={handleForecastRealChg(1, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 3",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(2, p)}
          onChange={handleForecastChg(2, p)}
          onBlur={handleForecastRealChg(2, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 4",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(3, p)}
          onChange={handleForecastChg(3, p)}
          onBlur={handleForecastRealChg(3, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 5",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(4, p)}
          onChange={handleForecastChg(4, p)}
          onBlur={handleForecastRealChg(4, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 6",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(5, p)}
          onChange={handleForecastChg(5, p)}
          onBlur={handleForecastRealChg(5, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 7",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(6, p)}
          onChange={handleForecastChg(6, p)}
          onBlur={handleForecastRealChg(6, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 8",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(7, p)}
          onChange={handleForecastChg(7, p)}
          onBlur={handleForecastRealChg(7, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 9",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(8, p)}
          onChange={handleForecastChg(8, p)}
          onBlur={handleForecastRealChg(8, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 10",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(9, p)}
          onChange={handleForecastChg(9, p)}
          onBlur={handleForecastRealChg(9, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 11",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(4, p)}
          onChange={handleForecastChg(10, p)}
          onBlur={handleForecastRealChg(10, p)}
          type="number"
        />
      ),
    },
    {
      title: "n + 12",
      extractor: (p: Forecast) => (
        <TextField
          className={classes.field}
          value={getForecastVal(11, p)}
          onChange={handleForecastChg(11, p)}
          onBlur={handleForecastRealChg(11, p)}
          type="number"
        />
      ),
    },
    {
      extractor: (p: Forecast) => (
        <IconButton
          disabled={ctrlDisabled(p)}
          onClick={handleForecastReset(p)}
          color="primary"
        >
          <ReplayIcon />
        </IconButton>
      ),
    },
    {
      extractor: (p: Forecast) => (
        <IconButton
          disabled={ctrlDisabled(p)}
          onClick={handleForecastSubmit(p)}
          color="primary"
        >
          <SaveIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <MainList
        lst={Object.values(stateLst).sort(
          (a, b) => Date.parse(a.on) - Date.parse(b.on)
        )}
        cols={cols}
        selected={selected}
        selectedOnChange={selectedOnChange}
        width="70vw"
        minWidth={950}
        size="small"
        padding="none"
      />
    </ThemeProvider>
  );
};

export default ForecastMainList;
