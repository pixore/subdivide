import { State, Action, Actions, ActionType } from './types';
import { ContainerData, ContainerDataUpdate } from '../../types';
import Id from '../../utils/Id';
import * as containers from './containersReducer';

const generateDividers = (state: State) => {
  return state;
};

const reducer = (state: State, action: Action): State => {
  if (Array.isArray(action)) {
    return action.reduce(reducer, state);
  }

  return generateDividers({
    containers: containers.reducer(state.containers, action),
    dividers: state.dividers,
  });
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
  batch(actions: Action[]) {
    dispatch(actions);
  },
});

export { actionCreators, createActions };

export default reducer;
