import Id from '../../utils/Id';
import {
  ContainerData,
  ContainerDataUpdate,
  ContainersMap,
  DividersMap,
  DeepReadonly,
} from '../../types';

export enum ActionType {
  ADD_CONTAINER = 'ADD_CONTAINER',
  UPDATE_CONTAINER = 'UPDATE_CONTAINER',
  UPDATE_ROOT = 'UPDATE_ROOT',
  REMOVE_CONTAINER = 'REMOVE_CONTAINER',
}

export type Payload = Id | ContainerDataUpdate | ContainerData | Action[];

export interface Action {
  type: ActionType;
  payload: Payload;
}

export interface ActionsCreator {
  add: (data: ContainerData) => Action;
  update: (data: ContainerDataUpdate) => Action;
  updateRoot: (id: Id) => Action;
  remove: (id: Id) => Action;
}

export interface Actions {
  add: (data: ContainerData) => void;
  update: (data: ContainerDataUpdate) => void;
  remove: (id: Id) => void;
  updateRoot: (id: Id) => void;
  batch: (actions: Action[]) => void;
}

export interface State {
  rootId: Id;
  containers: ContainersMap;
  dividers: DividersMap;
}

export type ReadOnlyState = DeepReadonly<State>;
