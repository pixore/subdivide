import React from 'react';
import {
  ContainersMap,
  ContainerDataUpdate,
  NewContainerData,
  ContainerData,
} from '../types';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';

enum ActionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  BATCH = 'BATCH',
}

type Payload = Id | ContainerDataUpdate | ContainerData | Action[];

export interface Action {
  type: ActionType;
  payload: Payload;
}

export interface Actions {
  add: (data: NewContainerData, id?: Id) => Id;
  update: (data: ContainerDataUpdate) => void;
  remove: (id: Id) => void;
  batch: (actions: Action[]) => void;
}

export interface ActionsCreator {
  add: (data: NewContainerData, id?: Id) => Action;
  update: (data: ContainerDataUpdate) => Action;
  remove: (id: Id) => Action;
}

type UseContainers = [ContainersMap, Actions, ActionsCreator];

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

const initialState: ContainersMap = createInitialList();

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

const reducer = (
  state: ContainersMap,
  action: Action | Action[],
): ContainersMap => {
  if (Array.isArray(action)) {
    return action.reduce(reducer, state);
  }

  const { type, payload } = action;

  switch (type) {
    case ActionType.ADD:
      return reducerAdd(state, payload as ContainerData);
    case ActionType.UPDATE:
      return reducerUpdate(state, payload as ContainerDataUpdate);
    case ActionType.REMOVE:
      return reducerRemove(state, payload as Id);
  }

  return state;
};

const actionCreators = {
  add: (data: NewContainerData) => ({
    type: ActionType.ADD,
    payload: data as ContainerData,
  }),
  update: (data: ContainerDataUpdate) => ({
    type: ActionType.UPDATE,
    payload: data,
  }),
  remove: (id: Id) => ({
    type: ActionType.UPDATE,
    payload: id,
  }),
};

type Dispatch = (action: Action | Action[]) => void;
const createActions = (dispatch: Dispatch): Actions => ({
  add(data: NewContainerData): Id {
    data.id = data.id || Id.create();
    dispatch(actionCreators.add(data));

    return data.id;
  },
  update(data: ContainerDataUpdate) {
    dispatch(actionCreators.update(data));
  },
  remove(id: Id) {
    dispatch(actionCreators.remove(id));
  },
  batch(actions) {
    dispatch(actions);
  },
});

const useContainers = (): UseContainers => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const actions = React.useMemo(() => createActions(dispatch), [dispatch]);

  return [state, actions, actionCreators];
};

export default useContainers;
