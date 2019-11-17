import { Action, ActionType, ShowOverlay } from '../types';
import { Overlay } from '../../types';

const overlayReducer = (state: Overlay, action: Action): Overlay => {
  const { type, payload } = action;

  if (type === ActionType.SHOW_OVERLAY) {
    return {
      ...(payload as ShowOverlay),
      show: true,
    };
  }

  if (type === ActionType.HIDE_OVERLAY) {
    return {
      ...state,
      show: false,
    };
  }

  return state;
};

export default overlayReducer;
