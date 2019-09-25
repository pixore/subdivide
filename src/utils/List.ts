const updateItem = <T extends object>(
  list: T[],
  index: number,
  values: object,
): T[] => {
  const item = list[index];

  return [
    ...list.slice(0, index),
    Object.assign({}, item, values),
    ...list.slice(index + 1),
  ];
};

const removeItem = <T extends object>(list: T[], index: number): T[] => {
  return [...list.slice(0, index), ...list.slice(index + 1)];
};

const List = {
  removeItem,
  updateItem,
};

export default List;
