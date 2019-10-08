import Percentage from './Percentage'
import { Size } from '../types';

interface Vector {
  x: number;
  y: number;
}

const fromSize = (size: Size) => ({
  x: size.width,
  y: size.height,
});

const ofPercentage = (delta1: Vector, delta2: Vector) => ({
  x: Percentage.ofPercentage(delta1.x, delta2.x),
  y: Percentage.ofPercentage(delta1.y, delta2.y),
})

const Vector = {
  fromSize,
  ofPercentage,
};

export default Vector