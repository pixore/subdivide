import { ContainerUpdate } from '../types';
import { Action, ActionsCreator, ActionType, Actions } from './types';
import Id from '../utils/Id';
import Container from '../utils/Container';

const actionCreators: ActionsCreator = {
  add: (data: Container) => ({
    type: ActionType.ADD_CONTAINER,
    payload: data as Container,
  }),
  update: (data: ContainerUpdate) => ({
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
  add(data: Container) {
    dispatch(actionCreators.add(data));
  },
  update(data: ContainerUpdate) {
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
