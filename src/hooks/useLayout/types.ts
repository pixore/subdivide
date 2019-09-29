import Id from '../../utils/Id';
import {
  ContainerData,
  DividerData,
  ContainerDataUpdate,
  DividerDataUpdate,
  ContainersMap,
  DividersMap,
  DeepReadonly,
} from '../../types';

export enum ActionType {
  ADD_CONTAINER = 'ADD_CONTAINER',
  ADD_DIVIDER = 'ADD_DIVIDER',
  UPDATE_CONTAINER = 'UPDATE_CONTAINER',
  UPDATE_DIVIDER = 'UPDATE_DIVIDER',
  REMOVE_CONTAINER = 'REMOVE_CONTAINER',
  REMOVE_DIVIDER = 'REMOVE_DIVIDER',
}

export type Payload =
  | Id
  | DividerDataUpdate
  | DividerData
  | Action[]
  | ContainerDataUpdate
  | ContainerData;

export interface Action {
  type: ActionType;
  payload: Payload;
}

export interface ActionsCreator {
  containers: {
    add: (data: ContainerData) => Action;
    update: (data: ContainerDataUpdate) => Action;
    remove: (id: Id) => Action;
  };
  dividers: {
    add: (data: DividerData) => Action;
    update: (data: DividerDataUpdate) => Action;
    remove: (id: Id) => Action;
  };
}

export interface ContainersActions {
  add: (data: ContainerData) => void;
  update: (data: ContainerDataUpdate) => void;
  remove: (id: Id) => void;
}

export interface DividersActions {
  add: (data: DividerData) => void;
  update: (data: DividerDataUpdate) => void;
  remove: (id: Id) => void;
}

export interface Actions {
  containers: ContainersActions;
  dividers: DividersActions;
  batch: (actions: Action[]) => void;
}

export interface State {
  containers: ContainersMap;
  dividers: DividersMap;
}

export type ReadOnlyState = DeepReadonly<State>;
