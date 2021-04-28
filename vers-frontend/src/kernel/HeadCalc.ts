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
}

class HeadCalc {
  vars: CalcVars;

  constructor(vars: CalcVars = initVars) {
    this.vars = vars;
  }

  setVars = (vars?: CalcVars) => {
    this.vars = vars ?? initVars;
  }

  getVars = () => this.vars;

  private totalAvailTime = () => {
    return (
      this.vars.minPerDayPerOp -
      this.vars.teaBreak * this.vars.noTeaBreak -
      this.vars.lunchBreak * this.vars.noLunchBreak
    );
  };

  calcHeadcountReq = (
    skill: Skill,
    subsec: Subsector,
    forecast: number,
    workingDays: number = 30
  ) => {
    let workingMinsReq = (forecast * subsec.cycleTime) / (subsec.efficiency / 100);
    let availMinsPerDayPerOp = this.totalAvailTime();
    let availMinsPerOp = availMinsPerDayPerOp * workingDays;
    return workingMinsReq / availMinsPerOp * (skill.percentageOfSubsector / 100) / (1 - this.vars.absentism);
  };
}

export default HeadCalc;