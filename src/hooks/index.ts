import React from 'react';
import List from '../utils/List';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';
import { ContainerData, ContainerDataUpdate, NewContainerData } from '../types';

interface ContainersActions {
  add: (data: NewContainerData, id?: Id) => number;
  update: (data: ContainerDataUpdate | ContainerDataUpdate[]) => void;
  remove: (index: number) => void;
}

interface ContainersMap {
  [id: number]: ContainerData;
}

type UseContainers = [ContainersMap, ContainersActions];

const createInitialList = (): ContainersMap => {
  const { innerWidth: width, innerHeight: height } = window;
  const item = {
    id: Id.create(),
    top: Percentage.create(height, 0),
    left: Percentage.create(width, 0),
    width: Percentage.create(width, width),
    height: Percentage.create(height, height),
  };

  return {
    [item.id]: item,
  };
};

const useContainers = (): UseContainers => {
  const [map, setMap] = React.useState<ContainersMap>(createInitialList());

  const add = (data: NewContainerData, id = Id.create()): Id => {
    const container: ContainerData = {
      id,
      ...data,
    };

    setMap((map) => ({
      ...map,
      [id]: container,
    }));

    return id;
  };

  const update = (data: ContainerDataUpdate | ContainerDataUpdate[]) => {
    const getUpdatedContainer = (
      map: ContainersMap,
      data: ContainerDataUpdate,
    ) => {
      const { id } = data;
      const container = map[id];
      return {
        ...container,
        ...data,
      };
    };

    setMap((map) => {
      if (Array.isArray(data)) {
        const containersToUpdate = data.reduce((partialMap, currentData) => {
          const { id } = currentData;
          // this is a new object, don't care if it's mutated here
          partialMap[id] = getUpdatedContainer(map, currentData);

          return partialMap;
        }, {});

        return {
          ...map,
          ...containersToUpdate,
        };
      }

      const { id } = data;
      return {
        ...map,
        [id]: getUpdatedContainer(map, data),
      };
    });
  };

  const remove = (id: Id) => {
    setMap((map) => {
      const newMap = { ...map };
      // this is a new object, don't care if it's mutated here
      Reflect.deleteProperty(newMap, id);

      return newMap;
    });
  };

  const actions = {
    add,
    update,
    remove,
  };

  return [map, actions];
};

const hooks = {
  useContainers,
};

export default hooks;
