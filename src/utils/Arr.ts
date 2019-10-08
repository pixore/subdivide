const omit = <T>(arr: readonly T[], index: number) => {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
};

const omitItem = <T>(arr: readonly T[], item: T) => {
  const index = arr.indexOf(item);
  return omit(arr, index);
};

const replace = <T>(arr: readonly T[], index: number, items: T[]): T[] => {
  return [...arr.slice(0, index), ...items, ...arr.slice(index + 1)];
};

const replaceItem = <T>(arr: readonly T[], item: T, items: T[]): T[] => {
  const index = arr.indexOf(item);
  return replace(arr, index, items);
};

const Arr = {
  omit,
  omitItem,
  replace,
  replaceItem,
};

export default Arr;
