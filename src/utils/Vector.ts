import Percentage from './Percentage';
import { Size, Position } from '../types';

interface Vector {
  x: number;
  y: number;
}

const fromSize = (size: Size): Vector => ({
  x: size.width,
  y: size.height,
});

const fromPosition = (position: Position): Vector => ({
  x: position.left,
  y: position.top,
});

const add = (vector1: Vector, vector2: Vector) => {
  return {
    x: vector1.x + vector2.x,
    y: vector1.y + vector2.y,
  };
};

const subtract = (vector1: Vector, vector2: Vector) => {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y,
  };
};

const fromPercentage = (
  vector: Vector,
  totalX: number,
  totalY: number,
): Vector => {
  return {
    x: Percentage.create(totalX, vector.x),
    y: Percentage.create(totalY, vector.y),
  };
};

const ofPercentage = (delta1: Vector, delta2: Vector) => ({
  x: Percentage.ofPercentage(delta1.x, delta2.x),
  y: Percentage.ofPercentage(delta1.y, delta2.y),
});

const invert = (vector: Vector): Vector => ({
  x: -vector.x,
  y: -vector.y,
});

const Vector = {
  add,
  subtract,
  invert,
  fromPosition,
  fromPercentage,
  fromSize,
  ofPercentage,
};

export default Vector;
