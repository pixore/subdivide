import { ContainersMap, ContainerDataUpdate, ContainerData } from '../../types';
import { Action, ActionType, ContainersActions } from './types';
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

const reducer = (state: ContainersMap, action: Action): ContainersMap => {
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

const actionCreators = {
  add: (data: ContainerData) => ({
    type: ActionType.ADD_CONTAINER,
    payload: data as ContainerData,
  }),
  update: (data: ContainerDataUpdate) => ({
    type: ActionType.UPDATE_CONTAINER,
    payload: data,
  }),
  remove: (id: Id) => ({
    type: ActionType.UPDATE_CONTAINER,
    payload: id,
  }),
};

type Dispatch = (action: Action | Action[]) => void;
const createActions = (dispatch: Dispatch): ContainersActions => ({
  add(data: ContainerData) {
    dispatch(actionCreators.add(data));
  },
  update(data: ContainerDataUpdate) {
    dispatch(actionCreators.update(data));
  },
  remove(id: Id) {
    dispatch(actionCreators.remove(id));
  },
});

export { createActions, reducer, actionCreators };
