export function filterRangeInPlace<T>(arr: T[], pred: (x: T) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    if (pred(arr[i])) {
      arr.splice(i, 1);
      i--;
    }
  }
}

export function toRegExp(str: string) {
  str = str.replace(".", "\\.").replace("*", "\\*").replace("$", "\\$").replace("^", "\\^");
  return new RegExp(str);
}

export interface CalE<T> {
  range: [Date, Date];
  data: T;
}

type EMDict<T> = { [month: string]: Set<CalE<T>> };
type EYDict<T> = { [year: string]: EMDict<T> };

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const getNoOfDays = (month: Date): number => {
  let st = new Date(month);
  st.setDate(1);
  let en = new Date(st);
  en.setMonth(st.getMonth() + 1);
  const diffTime = Math.abs(en.getTime() - st.getTime());
  return diffTime / _MS_PER_DAY;
};

const getDaysSet = (month: Date): Set<number> => {
  let sz = getNoOfDays(month);
  return new Set([...new Array(sz).keys()].map((x) => x + 1));
};

const getMonths = (st: Date, en: Date): [number, number][] => {
  let ans: [number, number][] = [];
  for (let y = st.getFullYear(); y < en.getFullYear(); y++) {
    for (let m = 0; m < 12; m++) {
      ans.push([y, m]);
    }
  }
  let y = en.getFullYear();
  let stt = new Date(en);
  stt.setMonth(0);
  stt = stt < st ? st : stt;
  for (let m = stt.getMonth(); m <= en.getMonth(); m++) {
    ans.push([y, m]);
  }
  return ans;
};

type MapK = string | number;

export class Cal<T> {
  hasher: (t: T) => MapK;
  events: EYDict<T> = {};
  dataEMap: { [d: string]: CalE<T> } = {};
  constructor(hasher: (t: T) => MapK = t => (t as unknown as MapK)) {
    this.hasher = hasher;
  }

  addEvent = (e: CalE<T>) => {
    this.dataEMap[this.hasher(e.data)] = e;
    for (let [y, m] of getMonths(e.range[0], e.range[1])) {
      if (!(y in this.events)) this.events[y] = {};
      if (!(m in this.events[y])) this.events[y][m] = new Set();
      this.events[y][m].add(e);
    }
  };

  addEvents = (es: CalE<T>[]) => {
    es.forEach(this.addEvent);
  };

  delEvent = (e: CalE<T>) => {
    let ee = this.dataEMap[this.hasher(e.data)];
    for (let [y, m] of getMonths(e.range[0], e.range[1])) {
      if (!(y in this.events && m in this.events[y])) continue;
      this.events[y][m].delete(ee);
    }
    delete this.dataEMap[this.hasher(e.data)];
  };

  clearEvents = () => {
    this.events = {};
  };

  isFree = (date: Date) => {
    let y = date.getFullYear(),
      m = date.getMonth();
    return (
      y in this.events &&
      m in this.events[y] &&
      [...this.events[y][m]].some(
        (x) => x.range[0] <= date && x.range[1] >= date
      )
    );
  };

  getDaysLeftInMonth = (month: Date) => {
    let dSet = getDaysSet(month);
    let y = month.getFullYear(),
      m = month.getMonth();
    let ma = this.events;
    let eSet = y in ma && m in ma[y] ? ma[y][m] : new Set<CalE<T>>();
    for (let e of eSet) {
      for (let i = e.range[0].getDate(); i <= e.range[1].getDate(); i++) {
        dSet.delete(i);
      }
    }
    return dSet.size;
  };
}
