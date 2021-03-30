export function filterRangeInPlace<T>(arr: T[], pred: (x: T) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    if (pred(arr[i])) {
      arr.splice(i, 1);
      i--;
    }
  }
}

export interface CalE {
  range: [Date, Date];
  data: any;
}

export class Cal {
  events: { [d: string]: Set<any> } = {};
  constructor(events: CalE[] = []) {
    this.addEvents(events);
  }

  addEvent = (e: CalE) => {
    let start = new Date(e.range[0]);
    let end = new Date(e.range[1]);
    for (; start !== end; start.setDate(start.getDate() + 1)) {
      if (!this.events[start.toDateString()]) this.events[start.toDateString()] = new Set();
      this.events[start.toDateString()].add(e.data);
    }
  }

  addEvents = (es: CalE[]) => {
    es.forEach(this.addEvent);
  }

  delEventByData = (data: any) => {
    
  }

  clearEvents = () => {
    this.events = {};
  }

  isFree = (date: Date) => {
    return date.toDateString() in this.events;
  }

  getDaysLeftInMonth = (month: Date) => {
    month.setDate(0);
    let start = new Date(month);
    month.setMonth(month.getMonth() + 1);
    let end = new Date(month);
    let ans = 27;

    return ans;
  }
}
