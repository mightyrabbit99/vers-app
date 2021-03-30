import * as React from "react";
import _ from "lodash";

import { makeStyles } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import { Skill, Subsector, Forecast, CalEvent } from "src/kernel";
import k from "src/kernel";

const useStyles = makeStyles((theme) => ({
  root: {},
  ctrlPanel: {},
  formControl: {},
}));

interface IHeadcountListWidgetProps {
  skills: { [id: number]: Skill };
  subsectors: { [id: number]: Subsector };
  forecasts: { [id: number]: Forecast };
  calEvents: { [id: number]: CalEvent };
}

interface IHeadcountListWidgetState {
  // input choices
  displaces: { [month: string]: { [n: number]: number } };

  // data
  skillLst: Skill[];
  forecastVal?: number;

  // internal
  selectedMonth?: string;
  selectedForecast?: number;
}

const initState: IHeadcountListWidgetState = {
  displaces: {},
  skillLst: [],
};

function reducer(
  state: IHeadcountListWidgetState,
  action: any
): IHeadcountListWidgetState {
  switch (action.type) {
    case "setDisplaces":
      return { ...state, displaces: action.data };
    case "setForecast":
      let n = action.data;
      if (n === undefined) return state; 
      let mo = state.selectedMonth ?? "";
      let val = mo in state.displaces && n in state.displaces[mo] ? state.displaces[mo][n] : 0;
      return { ...state, selectedForecast: n, forecastVal: val };
    case "setSkillLst":
      return { ...state, skillLst: action.data };
    case "setMonth":
      let valM = Object.entries(state.displaces[action.data]);
      return {
        ...state,
        selectedMonth: action.data,
        selectedForecast: valM.length === 1 ? parseInt(valM[0][0], 10) : undefined,
        forecastVal: valM.length === 1 ? valM[0][1] : undefined,
      };
    default:
      throw new Error();
  }
}

const HeadcountListWidget: React.FC<IHeadcountListWidgetProps> = (props) => {
  const { skills, subsectors, forecasts, calEvents } = props;
  const classes = useStyles(props);
  const [state, dispatch] = React.useReducer(reducer, initState);
  React.useEffect(() => {
    //generate choices
    let data = Object.values(forecasts).reduce((pr, cu) => {
      let d = new Date(Date.parse(cu.on));
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
  }, [forecasts]);

  React.useEffect(() => {
    // calc headcount
    if (!(state.forecastVal && state.selectedMonth)) return;
    let data: Skill[] = Object.values(skills).map((x) => ({
      ...x,
      headcount: k.calcHeadcountReq(
        x,
        subsectors[x.subsector],
        state.forecastVal ?? 0,
        state.selectedMonth
      ),
    }));
    dispatch({ type: "setSkillLst", data });
  }, [skills, subsectors, calEvents, state.forecastVal, state.selectedMonth]);

  const handleSelMonth = (e: React.ChangeEvent<any>) => {
    let { value } = e.target;
    dispatch({ type: "setMonth", data: value });
  };

  const handleSetForecast = (e: React.ChangeEvent<any>) => {
    let { value } = e.target;
    dispatch({ type: "setForecast", data: value });
  };

  const genForecastMenuItem = () => {
    if (!(state.selectedMonth && state.selectedMonth in state.displaces))
      return null;
    let lst = Object.entries(state.displaces[state.selectedMonth ?? ""]);
    return lst.map((x, idx) => (
      <MenuItem key={idx} value={x[0]}>
        {x[0]}
      </MenuItem>
    ));
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Grid container className={classes.ctrlPanel}>
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
                {Object.keys(state.displaces).map((x, idx) => (
                  <MenuItem key={idx} value={x}>
                    {x.slice(0, 7)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Forecast</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                disabled={
                  !(
                    state.selectedMonth &&
                    state.selectedMonth in state.displaces
                  )
                }
                value={state.selectedForecast ?? ""}
                onClick={handleSetForecast}
              >
                {genForecastMenuItem()}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HeadcountListWidget;
