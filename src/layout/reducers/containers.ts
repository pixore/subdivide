import { ContainersMap, ContainerDataUpdate, ContainerData } from '../../types';
import { Action, ActionType } from '../types';
import Id from '../../utils/Id';

const reducerAdd = (
  state: ContainersMap,
  data: ContainerData,
): ContainersMap => {
  const { id } = data;
  return {
    ...state,
    [id]: data,
  };
};

const reducerUpdate = (
  state: ContainersMap,
  data: ContainerDataUpdate,
): ContainersMap => {
  const { id } = data;
  const container = state[id];

  return {
    ...state,
    [id]: {
      ...container,
      ...data,
    },
  };
};

const reducerRemove = (state: ContainersMap, id: Id): ContainersMap => {
  const newState = { ...state };
  // this is a new object, don't care if it's mutated here
  Reflect.deleteProperty(newState, id);
  return newState;
};

const containersReducer = (
  state: ContainersMap,
  action: Action,
): ContainersMap => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.ADD_CONTAINER:
      return reducerAdd(state, payload as ContainerData);
    case ActionType.UPDATE_CONTAINER:
      return reducerUpdate(state, payload as ContainerDataUpdate);
    case ActionType.REMOVE_CONTAINER:
      return reducerRemove(state, payload as Id);
  }

  return state;
};

export default containersReducer;
