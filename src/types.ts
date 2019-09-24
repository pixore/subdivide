import Direction from './utils/Direction';

export type ID = number;

export interface FromCorner {
  vertical: Direction;
  horizontal: Direction;
  x: number;
  y: number;
}

export type Size = number | string;

export interface ContainerData {
  id: ID;
  parent: ID;
  width: Size;
  height: Size;
  top: number;
  left: number;
}

export interface NewContainerData {
  parent: ID;
  width: Size;
  height: Size;
  top: number;
  left: number;
}

export type AddContainer = (data: NewContainerData) => ID;
