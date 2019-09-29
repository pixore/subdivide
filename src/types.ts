import Direction from './utils/Direction';
import Id from './utils/Id';

export interface Group {
  id: Id;
  divider: Id;
  items: Id[];
}

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
  parentDivider?: Id;
  parentContainer?: Id;
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

export interface DividersMap {
  [id: number]: DividerData;
}

export interface ContainerDataUpdate {
  id: Id;
  parentDivider?: Id;
  parentContainer?: Id;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  previous?: Id;
  next?: Id;
  directionType?: Direction.DirectionType;
}

export interface DividerData {
  id: Id;
  directionType: Direction.DirectionType;
  previous: Id[];
  next: Id[];
  height: number;
  width: number;
  top: number;
  left: number;
}

export interface DividerDataUpdate {
  id: Id;
  previous?: Id[];
  next?: Id[];
  height?: number;
  width?: number;
  top?: number;
  left?: number;
}

export interface SplitArgs {
  containerId: number;
  from: FromCorner;
}

export interface ResizeArgs {
  previous: Id[];
  next: Id[];
  dividerId: Id;
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

export type AddContainer = (data: ContainerData) => Id;
export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;

/** Like Readonly but recursive */
export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Function
  ? T
  : T extends Date
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<K, V>
  : T extends Set<infer U>
  ? ReadonlySet<U>
  : T extends {}
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : Readonly<T>;
