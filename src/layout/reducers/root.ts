import { Action, ActionType } from '../types';

const rootReducer = (state: number, action: Action): number => {
  const { type, payload } = action;

  if (type === ActionType.UPDATE_ROOT) {
    return payload as number;
  }

  return state;
};

export default rootReducer;
