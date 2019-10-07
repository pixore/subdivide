import Direction, { DirectionType } from './utils/Direction';
import Id from './utils/Id';
import Container from './utils/Container';

export interface Overlay {
  top: number;
  left: number;
  width: number;
  height: number;
  show: boolean;
  direction: Direction;
}

export type Component = React.ComponentType<any>;

export interface Vector {
  x: number;
  y: number;
}

export interface FromCorner {
  vertical: Direction;
  horizontal: Direction;
  x: number;
  y: number;
}

export interface FromDivider {
  directionType: DirectionType;
  x: number;
  y: number;
}

export interface ContainersMap {
  [id: number]: Container;
}

export interface DividersMap {
  [id: string]: Divider;
}
export interface ContainerUpdate {
  id: Id;
  parent?: Id;
  children?: Id[];
  directionType?: DirectionType;
  splitRatio?: number;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

export interface Divider {
  id: string;
  directionType: DirectionType;
  previous: Id;
  next: Id;
  height: number;
  width: number;
  top: number;
  left: number;
}

export interface Corner {
  vertical: Direction;
  horizontal: Direction;
}

export interface SplitArgs {
  containerId: number;
  from: FromCorner;
}

export interface ResizeArgs {
  previous: Id;
  next: Id;
  from: FromDivider;
}

interface Events {
  cornerDrag: (args: SplitArgs) => void;
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

export type AddContainer = (data: Container) => Id;
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
