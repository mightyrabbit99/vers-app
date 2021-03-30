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

  // internal
  selectedMonth?: string;
  forecastVal?: number;
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
      return { ...state, forecastVal: action.data };
    case "setSkillLst":
      return { ...state, skillLst: action.data };
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
    let { val } = e.target;
    dispatch({ type: "setMonth", data: val });
  };

  const handleSetForecast = (e: React.ChangeEvent<any>) => {
    let { val } = e.target;
    dispatch({ type: "setForecast", data: val });
  };

  const genForecastMenuItem = () => {
    if (!(state.selectedMonth && state.selectedMonth in state.displaces)) return null;
    let lst = Object.entries(state.displaces[state.selectedMonth ?? ""]);
    return lst.map((x, idx) => (
      <MenuItem key={idx} value={x[1]}>
        {x[0]}
      </MenuItem>
    ));
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Grid container className={classes.ctrlPanel}>
          <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                disabled={_.isEmpty(state.displaces)}
                onClick={handleSelMonth}
              >
                {Object.keys(state.displaces).map((x, idx) => (
                  <MenuItem key={idx} value={x}>
                    {x}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Month</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                fullWidth
                disabled={
                  !state.selectedMonth ||
                  !(state.selectedMonth in state.displaces)
                }
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
