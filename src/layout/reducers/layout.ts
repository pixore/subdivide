import { Action, ActionType } from '../types';
import { Layout, LayoutUpdate } from '../../types';

const layoutReducer = (state: Layout, action: Action): Layout => {
  const { type, payload } = action;

  if (type === ActionType.UPDATE_LAYOUT) {
    return {
      ...state,
      ...(payload as LayoutUpdate),
    };
  }

  return state;
};

export default layoutReducer;
