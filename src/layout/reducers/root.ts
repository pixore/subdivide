import Id from '../../utils/Id';
import { Action, ActionType } from '../types';

const rootReducer = (state: Id, action: Action): Id => {
  const { type, payload } = action;

  if (type === ActionType.UPDATE_ROOT) {
    return payload as Id;
  }

  return state;
};

export default rootReducer;
