import { Action, State } from '../types';
import rootReducer from './root';
import containersReducer from './containers';
import overlayReducer from './overlay';
import layoutReducer from './layout';

const actionReducer = (state: State, action: Action): State => {
  if (Array.isArray(action)) {
    return action.reduce(actionReducer, state);
  }

  return {
    rootId: rootReducer(state.rootId, action),
    overlay: overlayReducer(state.overlay, action),
    containers: containersReducer(state.containers, action),
    layout: layoutReducer(state.layout, action),
    dividers: state.dividers,
  };
};

export default actionReducer;
