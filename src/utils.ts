import Direction, { OptionalDirection } from './utils/Direction';
import { FromCorner } from './types';

interface Position {
  x: number;
  y: number;
}

const getVerticalDelta = (vertical: Direction, fromX: number, toX: number) => {
  if (vertical === Direction.TOP) {
    return toX - fromX;
  } else {
    return fromX - toX;
  }
};

const getHorizontalDelta = (
  horizontal: Direction,
  fromY: number,
  toY: number,
) => {
  if (horizontal === Direction.LEFT) {
    return toY - fromY;
  } else {
    return fromY - toY;
  }
};

const dragDirection = (
  from: FromCorner,
  to: Position,
  splitRatio: number,
): OptionalDirection => {
  const verticalDelta = getVerticalDelta(from.vertical, from.y, to.y);
  const horizontalDelta = getHorizontalDelta(from.horizontal, from.x, to.x);

  if (verticalDelta > horizontalDelta) {
    if (verticalDelta > splitRatio) {
      return Direction.getOpposite(from.vertical);
    }
    return undefined;
  } else {
    if (horizontalDelta > splitRatio) {
      return Direction.getOpposite(from.horizontal);
    }
    return undefined;
  }
};

const once = <R>(fn: (...args: any[]) => R) => {
  let called = false;
  let returnedValue;
  return (...args: any[]): R => {
    if (!called) {
      called = true;
      returnedValue = fn(...args);
    }

    return returnedValue;
  };
};

export { dragDirection, once };
