import { Action, State } from '../types';
import actionReducer from './actions';
import groupReducer from './groups';
import dividersReducer from './dividers';

const reducer = (state: State, action: Action | Action[]): State => {
  const stateAfterActions = actionReducer(state, action);

  const stateWithChildrenUpdated = groupReducer(stateAfterActions, action);

  return dividersReducer(stateWithChildrenUpdated);
};

export default reducer;
