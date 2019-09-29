import { State, Action } from './types';
import * as containers from './containersReducer';
import * as dividers from './dividersReducer';

const reducer = (state: State, action: Action) => {
  if (Array.isArray(action)) {
    return action.reduce(reducer, state);
  }

  console.log(action.type, action.payload);

  return {
    containers: containers.reducer(state.containers, action),
    dividers: dividers.reducer(state.dividers, action),
  };
};

type Dispatch = (action: Action | Action[]) => void;
export const createActions = (dispatch: Dispatch) => {
  return {
    containers: containers.createActions(dispatch),
    dividers: dividers.createActions(dispatch),
    batch(actions: Action[]) {
      dispatch(actions);
    },
  };
};

export const actionCreators = {
  containers: containers.actionCreators,
  dividers: dividers.actionCreators,
};

export default reducer;
