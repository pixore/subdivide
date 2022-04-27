import { ContainersMap, ContainerUpdate } from '../../types';
import { Action, ActionType } from '../types';
import Container from '../../utils/Container';

const reducerAdd = (state: ContainersMap, data: Container): ContainersMap => {
  const { id } = data;
  return {
    ...state,
    [id]: data,
  };
};

const reducerUpdate = (
  state: ContainersMap,
  data: ContainerUpdate,
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

const reducerRemove = (state: ContainersMap, id: number): ContainersMap => {
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
      return reducerAdd(state, payload as Container);
    case ActionType.UPDATE_CONTAINER:
      return reducerUpdate(state, payload as ContainerUpdate);
    case ActionType.REMOVE_CONTAINER:
      return reducerRemove(state, payload as number);
  }

  return state;
};

export default containersReducer;
