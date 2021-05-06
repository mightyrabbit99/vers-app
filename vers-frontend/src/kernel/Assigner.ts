type Job = number;
type Emp = number;
type Requirement = Map<Job, number>;
type Availables = Map<Job, Set<Emp>>;
type Assignment = Availables;

export class AssignerEnv {
  req: Requirement;
  avail: Availables;
  jobs: Set<Job> = new Set();
  emps: Set<Emp> = new Set();

  constructor(req: Requirement = new Map(), avail: Availables = new Map()) {
    this.req = req;
    this.avail = avail;
    this.init();
  }

  private init = () => {
    for (let k of this.req.keys()) {
      if (!this.avail.has(k)) this.avail.set(k, new Set());
    }
    this.jobs = new Set(this.req.keys());
    for (let arr of this.avail.values()) {
      arr.forEach(this.emps.add);
    }
  };

  setJobReq = (jobId: Job, count: number, empAvail?: Emp[]) => {
    this.req.set(jobId, count);
    this.jobs.add(jobId);
    if (!this.avail.has(jobId)) this.avail.set(jobId, new Set(empAvail ?? []));
  };

  setEmpAvail = (jobId: Job, ...empId: Emp[]) => {
    this.avail.set(jobId, new Set(empId));
  };
}

export interface Heuristic {
  getScore: (j: Job, e?: Emp) => number;
}

class GenericHeuristic implements Heuristic {
  getScore = (j: Job, e?: Emp) => 0;
}

interface Assessor {
  getScore: (assign: Assignment) => number;
  getDiff: (assign1: Assignment, assign2: Assignment) => number;
}

class MinTrainingsAssessor implements Assessor {
  private env: AssignerEnv;
  constructor(env: AssignerEnv) {
    this.env = env;
  }

  getScore = (assign: Assignment) => {
    let ans = 0;
    let c = 0;
    const { req, jobs } = this.env;
    for (let [j, amt] of req.entries()) {
      let empLst = assign.get(j) ?? new Set();
      if (amt > empLst.size) {
        ans++;
        c += amt - empLst.size;
      }
    }
    return ([...req.keys()].length - ans) * jobs.size - c;
  };

  private calcNotFullyAssignedJobs = (assign: Assignment) => {
    return [...this.env.jobs].filter((x) => {
      let req = this.env.req.get(x) ?? 0;
      let ass = assign.get(x) ?? 0;
      return req > ass;
    });
  };

  private calcUnassignedEmpNo = (assign: Assignment) => {
    let assignedEmp = [...assign.values()].reduce((pr, cu) => {
      cu.forEach(pr.add);
      return pr;
    }, new Set());
    return this.env.emps.size - assignedEmp.size;
  };

  getDiff = (assign1: Assignment, assign2: Assignment) => {
    let un1 = this.calcUnassignedEmpNo(assign1);
    let un2 = this.calcUnassignedEmpNo(assign2);
    if (un1 !== un2) return un1 - un2;
    return (
      this.calcNotFullyAssignedJobs(assign1).length -
      this.calcNotFullyAssignedJobs(assign2).length
    );
  };
}

class Assigner {
  private env: AssignerEnv;

  constructor(env: AssignerEnv = new AssignerEnv()) {
    this.env = env;
  }

  getHeuristicAssignment = (
    h: Heuristic = new GenericHeuristic()
  ): Assignment => {
    const { req, avail } = this.env;
    let ans: Assignment = new Map();
    let usedEmps: Set<number> = new Set();
    let entries = [...req.entries()].sort(
      (a, b) => h.getScore(b[0]) - h.getScore(a[0])
    );
    for (let [j, amt] of entries) {
      let empLst = avail.get(j) ?? new Set();
      let arr = [...empLst]
        .filter((x) => !usedEmps.has(x))
        .sort((a, b) => h.getScore(j, b) - h.getScore(j, a))
        .slice(0, amt);
      ans.set(j, new Set(arr));
      arr.forEach((x) => usedEmps.add(x));
    }
    return ans;
  };
}

export default Assigner;
