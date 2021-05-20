import { Skill } from "./Skill";
import { Subsector } from "./Subsector";

// tu: min
export interface CalcVars {
  minPerDayPerOp: number;
  teaBreak: number;
  lunchBreak: number;
  noTeaBreak: number;
  noLunchBreak: number;
  absentism: number;
}

const initVars: CalcVars = {
  minPerDayPerOp: 540,
  teaBreak: 15,
  lunchBreak: 40,
  noTeaBreak: 2,
  noLunchBreak: 1,
  absentism: 0.15,
};

class HeadCalc {
  _vars: CalcVars;

  constructor(vars: CalcVars = initVars) {
    this._vars = vars;
  }

  set vars(vars: CalcVars) {
    this._vars = vars;
  }

  get vars() {
    return this._vars;
  }

  private totalAvailTime = () => {
    return (
      this._vars.minPerDayPerOp -
      this._vars.teaBreak * this._vars.noTeaBreak -
      this._vars.lunchBreak * this._vars.noLunchBreak
    );
  };

  calcSubsecHeadcountReq = (
    subsec: Subsector,
    forecast: number,
    workingDays: number = 30
  ) => {
    let workingMinsReq =
      (forecast * subsec.cycleTime) / (subsec.efficiency / 100);
    let availMinsPerDayPerOp = this.totalAvailTime();
    let availMinsPerOp = availMinsPerDayPerOp * workingDays;
    return workingMinsReq / availMinsPerOp / (1 - this._vars.absentism);
  };

  calcHeadcountReq = (
    skill: Skill,
    subsec: Subsector,
    forecast: number,
    workingDays: number = 30
  ) => {
    return (
      this.calcSubsecHeadcountReq(subsec, forecast, workingDays) *
      (skill.percentageOfSubsector / 100)
    );
  };
}

export default HeadCalc;
