import Id from '../../utils/Id';
import { ActionType, Action, GroupsActions } from './types';
import { Group, GroupUpdate, GroupsMap } from '../../types';
const actionCreators = {
  add: (data: Group) => ({
    type: ActionType.ADD_GROUP,
    payload: data as Group,
  }),
  update: (data: GroupUpdate) => ({
    type: ActionType.UPDATE_GROUP,
    payload: data,
  }),
  remove: (id: Id) => ({
    type: ActionType.UPDATE_GROUP,
    payload: id,
  }),
};

type Dispatch = (action: Action | Action[]) => void;
const createActions = (dispatch: Dispatch): GroupsActions => ({
  add(data: Group) {
    dispatch(actionCreators.add(data));
  },
  update(data: GroupUpdate) {
    dispatch(actionCreators.update(data));
  },
  remove(id: Id) {
    dispatch(actionCreators.remove(id));
  },
});

const reducerAdd = (state: GroupsMap, data: Group): GroupsMap => {
  const { id } = data;
  return {
    ...state,
    [id]: data,
  };
};

const reducerUpdate = (state: GroupsMap, data: GroupUpdate): GroupsMap => {
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

const reducerRemove = (state: GroupsMap, id: Id): GroupsMap => {
  const newState = { ...state };
  // this is a new object, don't care if it's mutated here
  Reflect.deleteProperty(newState, id);
  return newState;
};

const reducer = (state: GroupsMap, action: Action): GroupsMap => {
  const { type, payload } = action;

  switch (type) {
    case ActionType.ADD_GROUP:
      return reducerAdd(state, payload as Group);
    case ActionType.UPDATE_GROUP:
      return reducerUpdate(state, payload as GroupUpdate);
    case ActionType.REMOVE_GROUP:
      return reducerRemove(state, payload as Id);
  }

  return state;
};

export { reducer, createActions, actionCreators };
