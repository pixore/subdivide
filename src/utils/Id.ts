let counter = 0;
const usedIds = new Set<number>();

export const addId = (id: number | number[]) => {
  if (Array.isArray(id)) {
    return id.forEach(addId);
  }

  usedIds.add(id);
};

export const createId = (): number => {
  while (usedIds.has(counter)) {
    counter = counter + 1;
  }

  const id = counter;

  addId(id);
  return id;
};
