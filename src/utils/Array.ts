const groupBy = function <T, U>(list: Array<T>, keyGetter: (item: T) => U): Array<{ key: U, value: T[] }> {
  const map = new Map<U, T[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return Array.from(map).map(i => { return { key: i[0], value: i[1] }; });
}
export { groupBy };
