import { Action, State } from '../types';
import rootReducer from './root';
import containersReducer from './containers';

const actionReducer = (state: State, action: Action): State => {
  if (Array.isArray(action)) {
    return action.reduce(actionReducer, state);
  }

  return {
    rootId: rootReducer(state.rootId, action),
    containers: containersReducer(state.containers, action),
    dividers: state.dividers,
  };
};

export default actionReducer;