import Id from '../utils/Id';
import Direction from '../utils/Direction';
import Container from '../utils/Container';
import {
  ContainerUpdate,
  ContainersMap,
  DividersMap,
  DeepReadonly,
  Overlay,
} from '../types';

export enum ActionType {
  ADD_CONTAINER = 'ADD_CONTAINER',
  UPDATE_CONTAINER = 'UPDATE_CONTAINER',
  UPDATE_ROOT = 'UPDATE_ROOT',
  REMOVE_CONTAINER = 'REMOVE_CONTAINER',
  SHOW_OVERLAY = 'SHOW_OVERLAY',
  HIDE_OVERLAY = 'HIDE_OVERLAY',
}

export interface ShowOverlay {
  top: number;
  left: number;
  width: number;
  height: number;
  direction: Direction;
}
export type Payload = Id | ContainerUpdate | Container | Action[] | ShowOverlay;

export interface Action {
  type: ActionType;
  payload: Payload;
}

export interface ActionsCreator {
  add: (data: Container) => Action;
  update: (data: ContainerUpdate | Container) => Action;
  updateRoot: (id: Id) => Action;
  remove: (id: Id) => Action;
  showOverlay: (data: ShowOverlay) => Action;
  hideOverlay: () => Action;
}

export interface Actions {
  add: (data: Container) => void;
  update: (data: ContainerUpdate | Container) => void;
  remove: (id: Id) => void;
  updateRoot: (id: Id) => void;
  batch: (actions: Action[]) => void;
  showOverlay: (data: ShowOverlay) => void;
  hideOverlay: () => void;
}

export interface MutableState {
  rootId: Id;
  containers: ContainersMap;
  dividers: DividersMap;
  overlay: Overlay;
}

export type State = DeepReadonly<MutableState>;
