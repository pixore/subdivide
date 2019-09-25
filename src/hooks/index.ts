import React from 'react';
import List from '../utils/List';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';
import { ContainerData, ContainerDataUpdate, NewContainerData } from '../types';

const createInitialList = () => {
  const { innerWidth: width, innerHeight: height } = window;
  const item = {
    id: Id.create(),
    top: Percentage.create(height, 0),
    left: Percentage.create(width, 0),
    width: Percentage.create(width, width),
    height: Percentage.create(height, height),
  };

  return [item];
};

interface ContainersActions {
  push: (data: NewContainerData, id?: Id) => number;
  update: (index: number, data: ContainerDataUpdate) => void;
  remove: (index: number) => void;
}

type UseContainers = [ContainerData[], ContainersActions];

const useContainers = (): UseContainers => {
  const [list, setList] = React.useState<ContainerData[]>(createInitialList());

  const push = (data: NewContainerData, id = Id.create()) => {
    const container: ContainerData = {
      id,
      ...data,
    };
    const index = list.length;
    setList((list) => list.concat(container));

    return index;
  };

  const update = (index: number, data: ContainerDataUpdate) => {
    setList((list) => List.updateItem(list, index, data));
  };

  const remove = (index: number) => {
    setList((list) => List.removeItem(list, index));
  };

  const actions = {
    push,
    update,
    remove,
  };

  return [list, actions];
};

const hooks = {
  useContainers,
};

export default hooks;
