import Direction from './utils/Direction';

export interface FromCorner {
  vertical: Direction;
  horizontal: Direction;
  x: number;
  y: number;
}

export type Size = number | string;

export interface ContainerData {
  id: number;
  parent: number;
  width: Size;
  height: Size;
  top: number;
  left: number;
}

export interface NewContainerData {
  parent: number;
  width: Size;
  height: Size;
  top: number;
  left: number;
}

export type AddContainer = (data: NewContainerData) => number;
