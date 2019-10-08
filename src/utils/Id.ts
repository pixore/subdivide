type Id = number;

let counter = 0;
const usedIds = new Set<Id>();

namespace Id {
  export const addId = (id: Id | Id[]) => {
    if (Array.isArray(id)) {
      return id.forEach(addId);
    }

    usedIds.add(id);
  };

  export const create = (): Id => {
    while (usedIds.has(counter)) {
      counter = counter + 1;
    }

    const id = counter;

    addId(id);
    return id;
  };
}

export default Id;
