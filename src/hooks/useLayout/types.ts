import Id from '../../utils/Id';
import {
  ContainerData,
  DividerData,
  ContainerDataUpdate,
  DividerDataUpdate,
  ContainersMap,
  DividersMap,
  DeepReadonly,
  GroupUpdate,
  Group,
  GroupsMap,
} from '../../types';

export enum ActionType {
  ADD_CONTAINER = 'ADD_CONTAINER',
  ADD_DIVIDER = 'ADD_DIVIDER',
  ADD_GROUP = 'ADD_GROUP',
  UPDATE_CONTAINER = 'UPDATE_CONTAINER',
  UPDATE_DIVIDER = 'UPDATE_DIVIDER',
  UPDATE_GROUP = 'UPDATE_GROUP',
  REMOVE_CONTAINER = 'REMOVE_CONTAINER',
  REMOVE_DIVIDER = 'REMOVE_DIVIDER',
  REMOVE_GROUP = 'REMOVE_GROUP',
}

export type Payload =
  | Id
  | DividerDataUpdate
  | DividerData
  | ContainerDataUpdate
  | ContainerData
  | Group
  | GroupUpdate
  | Action[];

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
  groups: {
    add: (data: Group) => Action;
    update: (data: GroupUpdate) => Action;
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

export interface GroupsActions {
  add: (data: Group) => void;
  update: (data: GroupUpdate) => void;
  remove: (id: Id) => void;
}

export interface Actions {
  containers: ContainersActions;
  dividers: DividersActions;
  groups: GroupsActions;
  batch: (actions: Action[]) => void;
}

export interface State {
  containers: ContainersMap;
  dividers: DividersMap;
  groups: GroupsMap;
}

export type ReadOnlyState = DeepReadonly<State>;
