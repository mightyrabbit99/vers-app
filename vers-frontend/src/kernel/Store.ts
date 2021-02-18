enum ItemType {
  Plant,
  Sector,
  Subsector,
  Job,
  Employee,
  Skill,
  Department,
  EmpSkill,
}

interface Item {
  id: number;
  _type: ItemType;
  [str: string]: any;
}

interface Result {
  success: boolean;
  data: any;
}

const emptySave = async () => ({ success: false, data: {} });
const emptyDelete = async () => ({ success: false, data: {} });

interface Store<T extends Item> {
  refresh: () => Promise<void>;
  get: (id: number) => T;
  search: (obj: any) => T[];
  getLst: () => { [id: number]: T };
  getNew: () => T;
  submit: (t: T) => Promise<Result>;
  submitNew: (t: T) => Promise<Result>;
  remove: (t: T) => Promise<void>;
}

function store<T extends Item>(
  get: () => Promise<T[]>,
  post: (t: T) => Promise<Result>,
  put: (t: T) => Promise<Result>,
  del: (t: T) => Promise<void>,
  generator: () => T,
  filterer?: (obj: any, lst: T[]) => T[]
) {
  return class implements Store<T> {
    private store: { [id: number]: T } = {};

    static generator = generator;

    refresh = async () => {
      this.clearAll();
      let lst = await get();
      lst.forEach(this.add);
    };

    private clearAll = () => {
      this.store = {};
    }

    private add = (t: T) => {
      this.store[t.id] = t;
    };

    private erase = (t: T) => {
      delete this.store[t.id];
    };

    get = (id: number) => this.store[id];

    search = (obj: any) =>
      filterer
        ? filterer(obj, Object.values(this.store))
        : Object.values(this.store);

    getLst = (): { [id: number]: T } => {
      return { ...this.store };
    };

    getNew = (): T => {
      return generator();
    };

    submitNew = async (t: T) => {
      try {
        let ans = await post(t);
        if (ans.success) this.add(t);
        return ans;
      } catch (error) {
        return { success: false, data: error };
      }
    };

    submit = async (t: T) => {
      try {
        let ans = await put(t);
        if (ans.success) Object.assign(this.store[t.id], t);
        return ans;
      } catch (error) {
        return { success: false, data: error };
      }
    };

    remove = async (t: T) => {
      this.erase(t);
      await del(t);
    };
  };
}

export type { Item, Store, Result };
export { ItemType, emptySave, emptyDelete };
export default store;
