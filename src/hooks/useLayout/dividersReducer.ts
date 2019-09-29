import Id from '../../utils/Id';
import { ActionType, Action, DividersActions } from './types';
import { DividersMap, DividerDataUpdate, DividerData } from '../../types';
const actionCreators = {
  add: (data: DividerData) => ({
    type: ActionType.ADD_DIVIDER,
    payload: data as DividerData,
  }),
  update: (data: DividerDataUpdate) => ({
    type: ActionType.UPDATE_DIVIDER,
    payload: data,
  }),
  remove: (id: Id) => ({
    type: ActionType.UPDATE_DIVIDER,
    payload: id,
  }),
};

type Dispatch = (action: Action | Action[]) => void;
const createActions = (dispatch: Dispatch): DividersActions => ({
  add(data: DividerData) {
    dispatch(actionCreators.add(data));
  },
  update(data: DividerDataUpdate) {
    dispatch(actionCreators.update(data));
  },
  remove(id: Id) {
    dispatch(actionCreators.remove(id));
  },
});

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

const reducer = (state: DividersMap, action: Action): DividersMap => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.ADD_DIVIDER:
      return reducerAdd(state, payload as DividerData);
    case ActionType.UPDATE_DIVIDER:
      return reducerUpdate(state, payload as DividerDataUpdate);
    case ActionType.REMOVE_DIVIDER:
      return reducerRemove(state, payload as Id);
  }

  return state;
};

export { reducer, createActions, actionCreators };
