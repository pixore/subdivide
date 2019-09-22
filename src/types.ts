export enum Vertical {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum Horizontal {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface FromCorner {
  vertical: Vertical;
  horizontal: Horizontal;
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
