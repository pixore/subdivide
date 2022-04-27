import Direction, { DirectionType } from './utils/Direction';
import Container from './utils/Container';

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  left: number;
  top: number;
}

export interface Layout {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface LayoutUpdate {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

export interface Overlay {
  top: number;
  left: number;
  width: number;
  height: number;
  show: boolean;
  direction: Direction;
}

export type Component = React.ComponentType<any>;

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

export type ContainersMap = Record<number | string, Container>;

export interface DividersMap {
  [id: string]: Divider;
}

export interface ContainerUpdate {
  id: number;
  parent?: number;
  children?: number[];
  directionType?: DirectionType;
  splitRatio?: number;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  state?: unknown;
}

export interface Divider {
  id: string;
  directionType: DirectionType;
  previous: number;
  next: number;
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
  previous: number;
  next: number;
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

export type AddContainer = (data: Container) => number;
