import Id from '../utils/Id';
import Container from '../utils/Container';
import {
  ContainerUpdate,
  ContainersMap,
  DividersMap,
  DeepReadonly,
} from '../types';

export enum ActionType {
  ADD_CONTAINER = 'ADD_CONTAINER',
  UPDATE_CONTAINER = 'UPDATE_CONTAINER',
  UPDATE_ROOT = 'UPDATE_ROOT',
  REMOVE_CONTAINER = 'REMOVE_CONTAINER',
}

export type Payload = Id | ContainerUpdate | Container | Action[];

export interface Action {
  type: ActionType;
  payload: Payload;
}

export interface ActionsCreator {
  add: (data: Container) => Action;
  update: (data: ContainerUpdate | Container) => Action;
  updateRoot: (id: Id) => Action;
  remove: (id: Id) => Action;
}

export interface Actions {
  add: (data: Container) => void;
  update: (data: ContainerUpdate | Container) => void;
  remove: (id: Id) => void;
  updateRoot: (id: Id) => void;
  batch: (actions: Action[]) => void;
}

export interface MutableState {
  rootId: Id;
  containers: ContainersMap;
  dividers: DividersMap;
}

export type State = DeepReadonly<MutableState>;
