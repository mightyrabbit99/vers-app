function filterRangeInPlace<T>(arr: T[], pred: (x: T) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    if (pred(arr[i])) {
      arr.splice(i, 1);
      i--;
    }
  }

}

export { filterRangeInPlace };