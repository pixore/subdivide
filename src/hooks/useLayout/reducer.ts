import { State, Action } from './types';
import * as containers from './containersReducer';
import * as dividers from './dividersReducer';
import * as groups from './groupReducer';

const reducer = (state: State, action: Action): State => {
  if (Array.isArray(action)) {
    return action.reduce(reducer, state);
  }

  return {
    containers: containers.reducer(state.containers, action),
    dividers: dividers.reducer(state.dividers, action),
    groups: groups.reducer(state.groups, action),
  };
};

type Dispatch = (action: Action | Action[]) => void;
export const createActions = (dispatch: Dispatch) => {
  return {
    containers: containers.createActions(dispatch),
    dividers: dividers.createActions(dispatch),
    groups: groups.createActions(dispatch),
    batch(actions: Action[]) {
      dispatch(actions);
    },
  };
};

export const actionCreators = {
  containers: containers.actionCreators,
  dividers: dividers.actionCreators,
  groups: groups.actionCreators,
};

export default reducer;
