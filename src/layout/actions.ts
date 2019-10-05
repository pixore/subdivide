import { ContainerData, ContainerDataUpdate } from '../types';
import { Action, ActionsCreator, ActionType, Actions } from './types';
import Id from '../utils/Id';

const actionCreators: ActionsCreator = {
  add: (data: ContainerData) => ({
    type: ActionType.ADD_CONTAINER,
    payload: data as ContainerData,
  }),
  update: (data: ContainerDataUpdate) => ({
    type: ActionType.UPDATE_CONTAINER,
    payload: data,
  }),
  remove: (id: Id) => ({
    type: ActionType.REMOVE_CONTAINER,
    payload: id,
  }),
  updateRoot: (id: Id) => ({
    type: ActionType.UPDATE_ROOT,
    payload: id,
  }),
};

type Dispatch = (action: Action | Action[]) => void;
const createActions = (dispatch: Dispatch): Actions => ({
  add(data: ContainerData) {
    dispatch(actionCreators.add(data));
  },
  update(data: ContainerDataUpdate) {
    dispatch(actionCreators.update(data));
  },
  remove(id: Id) {
    dispatch(actionCreators.remove(id));
  },
  updateRoot(id: Id) {
    dispatch(actionCreators.updateRoot(id));
  },
  batch(actions: Action[]) {
    dispatch(actions);
  },
});

export { actionCreators, createActions };
