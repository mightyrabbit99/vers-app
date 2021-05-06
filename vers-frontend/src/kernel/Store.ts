enum ItemType {
  Plant = "Plant",
  Sector = "Sector",
  Subsector = "Subsector",
  Job = "Job",
  Employee = "Employee",
  Skill = "Skill",
  EmpFile = "EmpFile",
  Log = "Log",
  Forecast = "Forecast",
  CalEvent = "CalEvent",
  User = "User",
  Department = "Department",
}

interface ItemT {
  id: number;
  _type: ItemType;
  non_field_errors?: string[];
}

interface Result<T> {
  success: boolean;
  statusText: string;
  data: T;
}

enum DataAction {
  CREATE_NEW = 0,
  EDIT = 1,
  DELETE = 2,
}

interface Activity<T> {
  typ: DataAction;
  original?: T;
  res: Result<T>;
}

interface Logger<T> {
  record: (a: Activity<T>) => void;
}

class GenericLogger<T> implements Logger<T> {
  record = (a: Activity<T>) => {};
}

interface Store<T extends ItemT> {
  // retrieval
  refresh: () => Promise<void>;
  get: (id: number) => T;
  getLst: (filterer?: (t: T) => boolean) => { [id: number]: T };
  getNew: (init?: Partial<T>) => T;

  // local storage
  add: (t: T) => void;
  erase: (t: T | number) => void;
  addData: (d: any) => void;
  eraseData: (d: any) => void;
  forEach: (f: (t: any) => any) => void;

  // server
  submit: (t: T) => Promise<Result<T>>;
  submitNew: (t: T) => Promise<Result<T>>;
  submitOrNew: (t: T) => Promise<Result<T>>;
  remove: (t: T | number) => Promise<Result<Partial<T>>>;

  // activity trigger
  registerBeforeTrigger: (f: (a: Activity<T>) => any) => void;
  registerAfterTrigger: (f: (a: Activity<T>) => any) => void;
  clearTriggers: () => void;
}

function store<T extends ItemT>(
  get: () => Promise<T[]>,
  post: (t: T) => Promise<Result<T>>,
  put: (t: T) => Promise<Result<T>>,
  del: (t: T) => Promise<Result<T>>,
  generator: (init?: any) => T,
  dataToObj: (data: any) => T = (x: any) => x as T,
  hasher?: (t: T) => string
) {
  return class implements Store<T> {
    private logger: Logger<T>;
    private store: { [id: number]: T } = {};
    private hStore: { [k: string]: T } = {};
    private beforeTriggers: ((a: Activity<T>) => any)[] = [];
    private afterTriggers: ((a: Activity<T>) => any)[] = [];

    constructor(logger: Logger<T> = new GenericLogger<T>()) {
      this.logger = logger;
    }

    private getNewId = () => {
      return Object.keys(this.store)
        .map((x) => parseInt(x, 10))
        .reduce((pr, cu) => Math.max(pr, cu), -1);
    };

    private clearAll = () => {
      this.store = {};
      this.hStore = {};
    };

    private preAction = (action: DataAction, t: T, original?: T) => {
      this.beforeTriggers.forEach((f) =>
        f({
          typ: action,
          original,
          res: { success: false, statusText: "", data: t },
        })
      );
    };

    private postAction = (action: DataAction, res: Result<T>, original?: T) => {
      this.logger.record({ typ: action, original, res });
      this.afterTriggers.forEach((f) => f({ typ: action, original, res }));
    };

    static generator = generator;

    refresh = async () => {
      this.clearAll();
      let lst = await get();
      lst.forEach(this.add);
    };

    add = (t: T) => {
      if (t.id === -1) t.id = this.getNewId();
      this.store[t.id] = t;
      hasher && (this.hStore[hasher(t)] = t);
    };

    erase = (tt: T | number) => {
      let t = typeof tt === "number" ? this.get(tt) : tt;
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
    };

    get = (id: number) => this.store[id];

    getLst = (filterer?: (t: T) => boolean): { [id: number]: T } => {
      return filterer
        ? Object.fromEntries(
            Object.entries(this.store).filter((x) => filterer(x[1]))
          )
        : { ...this.store };
    };

    getNew = (init?: Partial<T>): T => {
      return generator(init);
    };

    submitNew = async (t: T) => {
      this.preAction(DataAction.CREATE_NEW, t);
      const res = await post(t);
      res.success && this.add(res.data);
      this.postAction(DataAction.CREATE_NEW, res);
      return res;
    };

    submit = async (t: T) => {
      let original = this.get(t.id);
      this.preAction(DataAction.EDIT, t, original);
      const res = await put(t);
      res.success && this.add(res.data);
      this.postAction(DataAction.EDIT, res, original);
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

    remove = async (tt: T | number) => {
      let t: T = typeof tt === "number" ? this.get(tt) : tt;
      let original = this.get(t.id);
      this.preAction(DataAction.DELETE, t, original);
      const res = await del(t);
      res.success && this.erase(t);
      this.postAction(DataAction.DELETE, res, original);
      return res;
    };

    registerBeforeTrigger = (f: (a: Activity<T>) => any) => {
      this.beforeTriggers.push(f);
    };

    registerAfterTrigger = (f: (a: Activity<T>) => any) => {
      this.afterTriggers.push(f);
    };

    clearTriggers = () => {
      this.beforeTriggers = [];
      this.afterTriggers = [];
    };
  };
}

export type { ItemT, Store, Result, Activity, Logger };
export { ItemType, DataAction };
export default store;
