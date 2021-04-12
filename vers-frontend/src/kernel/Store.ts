enum ItemType {
  Plant = "Plant",
  Sector = "Sector",
  Subsector = "Subsector",
  Job = "Job",
  Employee = "Employee",
  Skill = "Skill",
  EmpSkill = "EmpSkill",
  Log = "Log",
  Forecast = "Forecast",
  CalEvent = "CalEvent",
  User = "User",
  Department = "Department",
}

interface ItemT {
  id: number;
  _type: ItemType;
  [str: string]: any;
}

interface Result {
  success: boolean;
  statusText: string;
  data: any;
}

interface Store<T extends ItemT> {
  // retrieval
  refresh: () => Promise<void>;
  get: (id: number) => T;
  getLst: (filterer?: (t: T) => boolean) => { [id: number]: T };
  getNew: (init?: any) => T;

  // local storage
  add: (t: any) => void;
  erase: (t: any) => void;
  addData: (d: any) => void;
  eraseData: (d: any) => void;
  forEach: (f: (t: any) => any) => void;

  // server
  submit: (t: T) => Promise<Result>;
  submitNew: (t: T) => Promise<Result>;
  submitOrNew: (t: T) => Promise<Result>;
  remove: (t: T) => Promise<Result>;
}

function store<T extends ItemT>(
  get: () => Promise<T[]>,
  post: (t: T) => Promise<Result>,
  put: (t: T) => Promise<Result>,
  del: (t: T) => Promise<Result>,
  generator: (init?: any) => T,
  dataToObj: (data: any) => T,
  hasher?: (t: T) => string
) {
  return class implements Store<T> {
    private store: { [id: number]: T } = {};
    private hStore: { [k: string]: T } = {};

    private getNewId = () => {
      return Object.keys(this.store)
        .map((x) => parseInt(x, 10))
        .reduce((pr, cu) => Math.max(pr, cu), -1);
    };

    static generator = generator;

    refresh = async () => {
      this.clearAll();
      let lst = await get();
      lst.forEach(this.add);
    };

    private clearAll = () => {
      this.store = {};
      this.hStore = {};
    };

    add = (t: T) => {
      if (t.id === -1) t.id = this.getNewId();
      this.store[t.id] = t;
      hasher && (this.hStore[hasher(t)] = t);
    };

    erase = (t: T) => {
      if (t.id === -1) return;
      delete this.store[t.id];
      hasher && delete this.hStore[hasher(t)];
    };

    addData = (d: any) => {
      this.add(dataToObj(d));
    };

    eraseData = (d: any) => {
      this.erase(dataToObj(d));
    };

    forEach = (f: (t: T) => any) => {
      Object.values(this.store).forEach(f);
    }

    get = (id: number) => this.store[id];

    getLst = (filterer?: (t: T) => boolean): { [id: number]: T } => {
      return filterer
        ? Object.fromEntries(
            Object.entries(this.store).filter((x) => filterer(x[1]))
          )
        : { ...this.store };
    };

    getNew = (init?: any): T => {
      return generator(init);
    };

    submitNew = async (t: T) => {
      const res = await post(t);
      console.log(res);
      res.success && this.add(res.data);
      return res;
    };

    submit = async (t: T) => {
      const res = await put(t);
      console.log(res);
      res.success && this.add(res.data);
      return res;
    };

    submitOrNew = async (t: T) => {
      if (hasher) {
        let v = this.hStore[hasher(t)];
        return v
          ? await this.submit({ ...t, id: v.id })
          : await this.submitNew(t);
      } else {
        return t.id === -1 ? await this.submitNew(t) : await this.submit(t);
      }
    };

    remove = async (t: T) => {
      const res = await del(t);
      res.success && this.erase(t);
      return res;
    };
  };
}

export type { ItemT, Store, Result };
export { ItemType };
export default store;
