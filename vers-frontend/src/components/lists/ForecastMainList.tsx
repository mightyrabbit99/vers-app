import * as React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import createMuiTheme, {
  ThemeOptions,
} from "@material-ui/core/styles/createMuiTheme";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import ReplayIcon from "@material-ui/icons/Replay";
import { Forecast } from "src/kernel";
import MainList, { Col } from "./MainList";
import { ThemeProvider } from "@material-ui/styles";
import NumTextField from "../commons/NumTextField";

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
    paddingLeft: 1,
    paddingRight: 1,
    width: 45,
    height: 20,
  },
  highlight: {
    color: "red",
  },
  ctrlButton: {
    width: 20,
    height: 20,
  },
}));

type FL = { [id: number]: Forecast };

interface IForecastMainListProps {
  lst: FL;
  fNLst?: number[];
  onSubmit: (...f: Forecast[]) => void;
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

const zwoelf = [...new Array(12).keys()].map((x, idx) => idx + 1);

const ForecastMainList: React.FC<IForecastMainListProps> = (props) => {
  const classes = useStyles(props);
  const { lst, fNLst = zwoelf, onSubmit, selected, selectedOnChange } = props;

  const [state, setState] = React.useState<IForecastMainListState>(initState);
  const { chgLst, stateLst } = state;

  React.useEffect(
    () =>
      setState((state) => ({
        chgLst: state.chgLst.filter((x) => x in lst),
        stateLst: {
          ...state.stateLst,
          ...Object.fromEntries(
            Object.entries(lst).filter(([x, y]) => !state.chgLst.includes(y.id))
          ),
        },
      })),
    [lst]
  );

  const handleForecastChg = (p: Forecast) => () => {
    setState((state) =>
      state.chgLst.includes(p.id)
        ? state
        : {
            ...state,
            chgLst: [...state.chgLst, p.id],
          }
    );
  };

  const handleForecastRealChg = (n: number, p: Forecast) => (value: number) => {
    let i = p.forecasts.findIndex((x) => x.n === n);
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
    setState((state) => ({
      stateLst: {
        ...state.stateLst,
        [p.id]: {
          ...p,
          forecasts: newForecasts,
        },
      },
      chgLst: state.chgLst.includes(p.id)
        ? state.chgLst
        : [...state.chgLst, p.id],
    }));
  };

  const handleForecastSubmit = (p: Forecast) => () => {
    setState((state) => ({
      ...state,
      chgLst: [...state.chgLst.filter((x) => x !== p.id)],
    }));
    onSubmit(p);
  };

  const handleForecastSubmitAll = () => {
    setState((state) => ({ ...state, chgLst: [] }));
    onSubmit(...chgLst.map((x) => state.stateLst[x]));
  };

  const handleForecastReset = (p: Forecast) => () => {
    setState((state) => ({
      chgLst: [...state.chgLst.filter((x) => x !== p.id)],
      stateLst: { ...state.stateLst, [p.id]: lst[p.id] },
    }));
  };

  const handleForecastResetAll = () => {
    setState({
      chgLst: [],
      stateLst: lst,
    });
  };

  const getForecastVal = (n: number, p: Forecast) => {
    let i = p.forecasts.findIndex((x) => x.n === n);
    return i === -1 ? 0 : p.forecasts[i].val;
  };

  const getOriginForecastVal = (n: number, p: Forecast) => {
    return getForecastVal(n, lst[p.id]);
  };

  const ctrlDisabled = React.useCallback(
    (p: Forecast) => {
      return !chgLst.includes(p.id);
    },
    [chgLst]
  );

  const cols: Col[] = [
    {
      title: "On",
      extractor: (p: Forecast) => {
        let d = new Date(p.on);
        return `${d.getMonth() + 1}/${d.getFullYear()}`;
      },
      comparator: (p1: Forecast, p2: Forecast) =>
        Date.parse(p1.on) - Date.parse(p2.on),
      style: {
        width: 50,
      },
    },
    {
      title: "Act.",
      extractor: (p: Forecast) => (
        <NumTextField
          className={clsx(
            classes.field,
            chgLst.includes(p.id) &&
              getOriginForecastVal(0, p) !== getForecastVal(0, p)
              ? classes.highlight
              : null
          )}
          value={getForecastVal(0, p)}
          onChange={handleForecastRealChg(0, p)}
          onEdit={handleForecastChg(p)}
        />
      ),
      comparator: (p1: Forecast, p2: Forecast) =>
        getForecastVal(0, p1) - getForecastVal(0, p2),
      style: {
        width: 60,
      },
    },
    ...fNLst.map((x) => ({
      title: `n+${x}`,
      extractor: (p: Forecast) => (
        <NumTextField
          className={clsx(
            classes.field,
            chgLst.includes(p.id) &&
              getOriginForecastVal(x, p) !== getForecastVal(x, p)
              ? classes.highlight
              : null
          )}
          value={getForecastVal(x, p)}
          onChange={handleForecastRealChg(x, p)}
          onEdit={handleForecastChg(p)}
        />
      ),
      comparator: (p1: Forecast, p2: Forecast) =>
        getForecastVal(x, p1) - getForecastVal(x, p2),
      style: {
        width: 60,
      },
    })),
    {
      title: (
        <IconButton
          disabled={state.chgLst.length === 0}
          onClick={handleForecastResetAll}
          color="primary"
          className={classes.ctrlButton}
        >
          <ReplayIcon />
        </IconButton>
      ),
      extractor: (p: Forecast) => (
        <IconButton
          disabled={ctrlDisabled(p)}
          onClick={handleForecastReset(p)}
          color="primary"
          className={classes.ctrlButton}
        >
          <ReplayIcon />
        </IconButton>
      ),
      style: {
        width: 50,
      },
    },
    {
      title: (
        <IconButton
          disabled={state.chgLst.length === 0}
          onClick={handleForecastSubmitAll}
          color="primary"
          className={classes.ctrlButton}
        >
          <SaveIcon />
        </IconButton>
      ),
      extractor: (p: Forecast) => (
        <IconButton
          disabled={ctrlDisabled(p)}
          onClick={handleForecastSubmit(p)}
          color="primary"
          className={classes.ctrlButton}
        >
          <SaveIcon />
        </IconButton>
      ),
      style: {
        width: 50,
      },
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
        minWidth={950}
        size="small"
        padding="none"
      />
    </ThemeProvider>
  );
};

export default ForecastMainList;
