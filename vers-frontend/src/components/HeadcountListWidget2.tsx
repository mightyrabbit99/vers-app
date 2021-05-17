import * as React from "react";
import _ from "lodash";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";

import k, {
  Skill,
  Subsector,
  Sector,
  CalEvent,
  CalcVars,
  Employee,
  Forecast,
} from "src/kernel";
import MyDialog from "src/components/commons/Dialog";
import HeadcountMainList from "./lists/HeadcountMainList";
import CalcVarsForm from "./forms/CalcVarsForm";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  ctrlPanel: {
    width: "inherit",
    height: "15%",
  },
  content: {
    height: "85%",
  },
  searchBar: {
    maxWidth: 250,
    marginLeft: "auto",
    marginRight: "auto",
  },
  formControl: {
    width: "inherit",
  },
  settingsIcon: {
    marginLeft: "auto",
  },
  title: {
    height: "15%",
  },
  form: {
    width: 700,
    minWidth: 600,
  },
  formTitle: {
    height: "15%",
  },
  formContent: {
    height: "85%",
  },
}));

interface IHeadcountListWidgetProps {
  sectors: { [id: number]: Sector };
  subsectors: { [id: number]: Subsector };
  skills: { [id: number]: Skill };
  calEvents: { [id: number]: CalEvent };
  employees?: { [id: number]: Employee };
}

type DisplaceMap = { [month: string]: { [n: number]: number } };

interface IHeadcountListWidgetState {
  // input choices
  forecasts: Forecast[];
  displaces: DisplaceMap;

  // data
  availDaysInMonth?: number;
  forecastVal?: number;
  formData: CalcVars;

  // display
  selectedSector?: number;
  selectedMonth?: string;
  selectedForecast?: number;
  skillLst: { [id: number]: Skill }; // headcound calculated
  formOpen: boolean;
}

const initState: IHeadcountListWidgetState = {
  forecasts: [],
  displaces: {},
  skillLst: {},
  formOpen: false,
  formData: k.getVars(),
};

function reducer(
  state: IHeadcountListWidgetState,
  action: any
): IHeadcountListWidgetState {
  let mo, n, valM, val;
  switch (action.type) {
    case "setDisplaces":
      return { ...state, displaces: action.data };
    case "setSelSectorAndForecasts":
      return {
        ...state,
        selectedSector: action.data?.selectedSector,
        forecasts: action.data?.forecasts ?? [],
      };
    case "setSelForecast":
      n = action.data;
      if (n === undefined) return state;
      mo = state.selectedMonth ?? "";
      val =
        mo in state.displaces && n in state.displaces[mo]
          ? state.displaces[mo][n]
          : 0;
      return { ...state, selectedForecast: n, forecastVal: val };
    case "setMonth":
      mo = action.data;
      if (!mo) return state;
      valM = Object.entries(state.displaces[mo]);
      return {
        ...state,
        selectedMonth: mo,
        selectedForecast:
          valM.length > 0 ? parseInt(valM[0][0], 10) : undefined,
        forecastVal: valM[0][1],
      };
    case "setSkillLst":
      return { ...state, skillLst: action.data };
    case "setFormOpen":
      return { ...state, formOpen: action.data };
    case "setFormData":
      return { ...state, formData: action.data };
    case "setAvailDaysInMonth":
      return { ...state, availDaysInMonth: action.data };
    default:
      throw new Error();
  }
}

const HeadcountListWidget: React.FC<IHeadcountListWidgetProps> = (props) => {
  const { skills, subsectors, sectors, employees } = props;
  const classes = useStyles(props);

  const [state, dispatch] = React.useReducer(reducer, initState);

  React.useEffect(() => {
    if (state.selectedSector !== undefined && state.selectedSector in sectors)
      return;
    let lst = Object.values(sectors);
    if (lst.length > 0)
      dispatch({
        type: "setSelSectorAndForecasts",
        data: {
          selectedSector: lst[0].id,
          forecasts: lst[0].forecasts,
        },
      });
    if (state.selectedSector !== undefined)
      dispatch({ type: "setSelSectorAndForecasts" });
  }, [sectors, state.selectedSector]);

  const handleSelSector = (e: React.ChangeEvent<any>) => {
    let { value: newId } = e.target;
    if (newId === undefined || newId === state.selectedSector) return;
    dispatch({
      type: "setSelSectorAndForecasts",
      data: {
        selectedSector: newId,
        forecasts: sectors[newId].forecasts,
      },
    });
  };

  React.useEffect(() => {
    //generate choices
    let data = state.forecasts.reduce((pr, cu) => {
      let d = new Date(cu.on);
      for (let fo of cu.forecasts) {
        let dd = new Date(d);
        dd.setMonth(d.getMonth() + fo.n);
        let dStr = dd.toISOString().slice(0, 10);
        if (!(dStr in pr)) pr[dStr] = {};
        pr[dStr][fo.n] = fo.val;
      }
      return pr;
    }, {} as { [month: string]: { [n: number]: any } });

    dispatch({ type: "setDisplaces", data });
  }, [state.forecasts]);

  React.useEffect(() => {
    // select first if has
    if (_.isEmpty(state.displaces)) return;
    let mP = Object.entries(state.displaces)[0];
    let fP = Object.entries(mP[1])[0];
    dispatch({ type: "setMonth", data: mP[0] });
    dispatch({ type: "setSelForecast", data: fP[0] });
  }, [state.displaces]);

  React.useEffect(() => {
    // calc available days of the month
    if (!state.selectedMonth) return;
    let mo = state.selectedMonth;
    let isCancelled = false;
    let f = async () => {
      let data = k.cal.getDaysLeftInMonth(new Date(mo));
      if (!isCancelled)
        dispatch({
          type: "setAvailDaysInMonth",
          data,
        });
    };
    f();
    return () => {
      isCancelled = true;
    };
  }, [state.selectedMonth]);

  const genSkillLst = React.useCallback(
    async (vars?: CalcVars, forecastVal?: number, selectedMonth?: string) => {
      if (vars) k.setVars(vars);
      return Object.fromEntries(
        Object.entries(skills)
          .filter(
            ([kk, v]) =>
              state.selectedSector === undefined ||
              subsectors[v.subsector].sector === state.selectedSector
          )
          .map(([kk, v]) => [
            kk,
            {
              ...v,
              headcount: selectedMonth
                ? k.calcHeadcountReq(v, forecastVal ?? 0, selectedMonth)
                : 0,
            },
          ])
      );
    },
    [skills, subsectors, state.selectedSector]
  );

  React.useEffect(() => {
    // calculate skill list and update calc vars
    let isCancelled = false;
    let f = async () => {
      let skillLst = await genSkillLst(
        state.formData,
        state.forecastVal,
        state.selectedMonth
      );
      if (!isCancelled) dispatch({ type: "setSkillLst", data: skillLst });
    };
    f();
    return () => {
      isCancelled = true;
    };
  }, [genSkillLst, state.formData, state.selectedMonth, state.forecastVal]);

  const handleSelMonth = (e: React.ChangeEvent<any>) => {
    let { value } = e.target;
    dispatch({ type: "setMonth", data: value });
  };

  const handleSetSelForecast = (e: React.ChangeEvent<any>) => {
    let { value } = e.target;
    dispatch({ type: "setSelForecast", data: value });
  };

  const genForecastMenuItem = React.useCallback(() => {
    if (!(state.selectedMonth && state.selectedMonth in state.displaces))
      return null;
    let lst = Object.entries(state.displaces[state.selectedMonth ?? ""]);
    return lst.map((x, idx) => (
      <MenuItem key={idx} value={x[0]}>
        {`${-x[0]}`}
      </MenuItem>
    ));
  }, [state.selectedMonth, state.displaces]);

  const setFormOpen = (o: boolean) => {
    dispatch({ type: "setFormOpen", data: o });
  };

  const handleSubmit = (data: CalcVars) => {
    dispatch({ type: "setFormData", data });
    setFormOpen(false);
  };

  const genHeader = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Sector</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              fullWidth
              value={state.selectedSector ?? ""}
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
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Month</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              fullWidth
              value={state.selectedMonth ?? ""}
              disabled={_.isEmpty(state.displaces)}
              onClick={handleSelMonth}
            >
              {Object.keys(state.displaces)
                .sort((a, b) => Date.parse(a) - Date.parse(b))
                .map((x, idx) => (
                  <MenuItem key={idx} value={x}>
                    {x.slice(0, 7)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Box component="span" m={1}>
            <Typography variant="body2">
              {`Working Days: ${state.availDaysInMonth ?? ""}`}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Forecast</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              fullWidth
              disabled={
                !(state.selectedMonth && state.selectedMonth in state.displaces)
              }
              value={state.selectedForecast ?? ""}
              onClick={handleSetSelForecast}
            >
              {genForecastMenuItem()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Box component="span" m={1}>
            <Typography variant="body2">
              {`Forecast Value: ${state.forecastVal ?? ""}`}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <IconButton
            className={classes.settingsIcon}
            onClick={() => setFormOpen(true)}
          >
            <SettingsIcon />
          </IconButton>
        </Grid>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <div className={classes.ctrlPanel}>{genHeader()}</div>
        <div className={classes.content}>
          <HeadcountMainList
            lst={state.skillLst}
            subsectorLst={subsectors}
            employeeLst={employees}
          />
        </div>
      </div>
      <MyDialog open={state.formOpen} onClose={() => setFormOpen(false)}>
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
            <CalcVarsForm
              data={state.formData}
              onSubmit={handleSubmit}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </div>
      </MyDialog>
    </React.Fragment>
  );
};

export default HeadcountListWidget;
