import { ContainerUpdate, Overlay, LayoutUpdate } from '../types';
import {
  Action,
  ActionsCreator,
  ActionType,
  Actions,
  ShowOverlay,
} from './types';
import Container from '../utils/Container';
import React from 'react';

const actionCreators: ActionsCreator = {
  add: (data: Container) => ({
    type: ActionType.ADD_CONTAINER,
    payload: data,
  }),
  update: (data: ContainerUpdate) => ({
    type: ActionType.UPDATE_CONTAINER,
    payload: data,
  }),
  remove: (id: number) => ({
    type: ActionType.REMOVE_CONTAINER,
    payload: id,
  }),
  updateRoot: (id: number) => ({
    type: ActionType.UPDATE_ROOT,
    payload: id,
  }),
  showOverlay: (data: ShowOverlay) => ({
    type: ActionType.SHOW_OVERLAY,
    payload: data,
  }),
  hideOverlay: () => ({
    type: ActionType.HIDE_OVERLAY,
    payload: -1,
  }),
  updateLayout: (data: LayoutUpdate) => ({
    type: ActionType.UPDATE_LAYOUT,
    payload: data,
  }),
};

type Dispatch = React.Dispatch<Action | Action[]>;
const createActions = (dispatch: Dispatch): Actions => ({
  add(data: Container) {
    dispatch(actionCreators.add(data));
  },
  update(data: ContainerUpdate) {
    dispatch(actionCreators.update(data));
  },
  remove(id: number) {
    dispatch(actionCreators.remove(id));
  },
  updateRoot(id: number) {
    dispatch(actionCreators.updateRoot(id));
  },
  updateLayout(data: LayoutUpdate) {
    dispatch(actionCreators.updateLayout(data));
  },
  batch(actions: Action[]) {
    dispatch(actions);
  },
  showOverlay(overlay: ShowOverlay) {
    dispatch(actionCreators.showOverlay(overlay));
  },
  hideOverlay() {
    dispatch(actionCreators.hideOverlay());
  },
});

export { actionCreators, createActions };
