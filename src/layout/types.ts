import Direction from '../utils/Direction';
import Container from '../utils/Container';
import {
  ContainerUpdate,
  Overlay,
  Layout,
  LayoutUpdate,
  DividersMap,
  ContainersMap,
} from '../types';

export enum ActionType {
  ADD_CONTAINER = 'ADD_CONTAINER',
  UPDATE_CONTAINER = 'UPDATE_CONTAINER',
  UPDATE_ROOT = 'UPDATE_ROOT',
  UPDATE_LAYOUT = 'UPDATE_LAYOUT',
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

export type Payload =
  | number
  | ContainerUpdate
  | Container
  | Action[]
  | ShowOverlay
  | LayoutUpdate;

export interface Action {
  type: ActionType;
  payload: Payload;
}

export interface ActionsCreator {
  add: (data: Container) => Action;
  update: (data: ContainerUpdate | Container) => Action;
  updateRoot: (id: number) => Action;
  updateLayout: (data: LayoutUpdate) => Action;
  remove: (id: number) => Action;
  showOverlay: (data: ShowOverlay) => Action;
  hideOverlay: () => Action;
}

export interface Actions {
  add: (data: Container) => void;
  update: (data: ContainerUpdate | Container) => void;
  updateRoot: (id: number) => void;
  updateLayout: (data: LayoutUpdate) => void;
  remove: (id: number) => void;
  batch: (actions: Action[]) => void;
  showOverlay: (data: ShowOverlay) => void;
  hideOverlay: () => void;
}

export interface State {
  rootId: number;
  containers: ContainersMap;
  dividers: DividersMap;
  overlay: Overlay;
  layout: Layout;
}

export interface RawState {
  rootId: number;
  containers: Record<
    number | string,
    {
      id: number;
      parent: number;
      children: number[];
      directionType?: string;
      splitRatio: number;
      isGroup: boolean;
      width: number;
      height: number;
      top: number;
      left: number;
      state?: unknown;
    }
  >;
  dividers: Record<
    string,
    {
      id: string;
      directionType: string;
      previous: number;
      next: number;
      height: number;
      width: number;
      top: number;
      left: number;
    }
  >;
  overlay: {
    top: number;
    left: number;
    width: number;
    height: number;
    show: boolean;
    direction: string;
  };
  layout: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}
