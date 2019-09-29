import Direction from './utils/Direction';
import Id from './utils/Id';

export interface FromCorner {
  vertical: Direction;
  horizontal: Direction;
  x: number;
  y: number;
}

export interface FromDivider {
  directionType: Direction.DirectionType;
  x: number;
  y: number;
}

export interface ContainerData {
  id: Id;
  width: number;
  height: number;
  top: number;
  left: number;
  previous?: Id;
  next?: Id;
  directionType?: Direction.DirectionType;
}

export interface ContainersMap {
  [id: number]: ContainerData;
}

export interface ContainerDataUpdate {
  id: Id;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  previous?: Id;
  next?: Id;
  directionType?: Direction.DirectionType;
}

export interface DividerData {
  directionType: Direction.DirectionType;
  previous: Id[];
  next: Id[];
  height: number;
  width: number;
  top: number;
  left: number;
}

export interface NewContainerData {
  id: Id;
  width: number;
  height: number;
  top: number;
  left: number;
  previous?: Id;
  next?: Id;
  directionType?: Direction.DirectionType;
}

export interface SplitArgs {
  containerId: number;
  from: FromCorner;
}

export interface ResizeArgs {
  previous: Id;
  next: Id;
  dividerIndex: number;
  from: FromDivider;
}

interface Events {
  split: (args: SplitArgs) => void;
  resize: (args: ResizeArgs) => void;
}

type Event = keyof Events;

// inspired by https://github.com/andywer/typed-emitter
type Args<T> = T extends (...args: infer U) => void
  ? U
  : [T] extends [void]
  ? []
  : [T];

export interface Emitter {
  on(event: Event, callback: Events[Event], ctx?: any): this;
  once(event: Event, callback: Events[Event], ctx?: any): this;
  emit(event: Event, ...args: Args<Events[Event]>): this;
  off(event: Event, callback?: Events[Event]): this;
}

export type AddContainer = (data: NewContainerData) => Id;
