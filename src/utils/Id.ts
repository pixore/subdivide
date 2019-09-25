
 type Id = number;

let counter = 0;

namespace Id {
  export const create = (): Id => {
    const id = counter;
    counter = counter + 1;

    return id
  }
}


export default Id