enum ItemType {
  Plant = "Plant",
  Sector = "Sector",
  Subsector = "Subsector",
  Job = "Job",
  Employee = "Employee",
  Skill = "Skill",
  Department = "Department",
  EmpSkill = "EmpSkill",
  Log = "Log",
  Forecast = "Forecast",
  CalEvent = "CalEvent",
  User = "User",
}

interface Item {
  id: number;
  _type: ItemType;
  [str: string]: any;
}

interface Result {
  success: boolean;
  statusText: string;
  data: any;
}

interface Store<T extends Item> {
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

  // server
  submit: (t: T) => Promise<Result>;
  submitNew: (t: T) => Promise<Result>;
  submitOrNew: (t: T) => Promise<Result>;
  remove: (t: T) => Promise<Result>;
}

function store<T extends Item>(
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
      this.store[t.id] = t;
      hasher && (this.hStore[hasher(t)] = t);
    };

    erase = (t: T) => {
      delete this.store[t.id];
      hasher && delete this.hStore[hasher(t)];
    };

    addData = (d: any) => {
      this.add(dataToObj(d));
    }

    eraseData = (d: any) => {
      this.erase(dataToObj(d));
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
      return res;
    };

    submit = async (t: T) => {
      const res = await put(t);
      console.log(res);
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
      return await del(t);
    };
  };
}

export type { Item, Store, Result };
export { ItemType };
export default store;
