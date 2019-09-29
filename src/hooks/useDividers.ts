import React from 'react';
import Id from '../utils/Id';
import { DividerData, DividerDataUpdate, DividersMap } from '../types';

enum ActionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  BATCH = 'BATCH',
}

type Payload = Id | DividerDataUpdate | DividerData | Action[];

export interface Action {
  type: ActionType;
  payload: Payload;
}

export interface Actions {
  add: (data: DividerData) => void;
  update: (data: DividerDataUpdate) => void;
  remove: (id: Id) => void;
  batch: (actions: Action[]) => void;
}

export interface ActionsCreator {
  add: (data: DividerData) => Action;
  update: (data: DividerDataUpdate) => Action;
  remove: (id: Id) => Action;
}

const actionCreators: ActionsCreator = {
  add: (data: DividerData) => ({
    type: ActionType.ADD,
    payload: data as DividerData,
  }),
  update: (data: DividerDataUpdate) => ({
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
  add(data: DividerData) {
    dispatch(actionCreators.add(data));
  },
  update(data: DividerDataUpdate) {
    dispatch(actionCreators.update(data));
  },
  remove(id: Id) {
    dispatch(actionCreators.remove(id));
  },
  batch(actions) {
    dispatch(actions);
  },
});

const initialState: DividersMap = [];

const reducerAdd = (state: DividersMap, data: DividerData): DividersMap => {
  const { id } = data;
  return {
    ...state,
    [id]: data,
  };
};

const reducerUpdate = (
  state: DividersMap,
  data: DividerDataUpdate,
): DividersMap => {
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

const reducerRemove = (state: DividersMap, id: Id): DividersMap => {
  const newState = { ...state };
  // this is a new object, don't care if it's mutated here
  Reflect.deleteProperty(newState, id);
  return newState;
};

const reducer = (
  state: DividersMap,
  action: Action | Action[],
): DividersMap => {
  if (Array.isArray(action)) {
    return action.reduce(reducer, state);
  }

  const { type, payload } = action;

  switch (type) {
    case ActionType.ADD:
      return reducerAdd(state, payload as DividerData);
    case ActionType.UPDATE:
      return reducerUpdate(state, payload as DividerDataUpdate);
    case ActionType.REMOVE:
      return reducerRemove(state, payload as Id);
  }

  return state;
};

type UseDividers = [
  React.MutableRefObject<DividersMap>,
  Actions,
  ActionsCreator,
];

const useDividers = (): UseDividers => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const actions = React.useMemo(() => createActions(dispatch), [dispatch]);
  const dividersRef = React.useRef<DividersMap>(state);

  dividersRef.current = state;

  return [dividersRef, actions, actionCreators];
};

export default useDividers;
