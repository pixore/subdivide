import Direction, { OptionalDirection } from './utils/Direction';
import { FromCorner, FromDivider } from './types';

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

const resizeDirection = (
  from: FromDivider,
  to: Position,
  directionType: Direction.DirectionType,
): Direction => {
  const verticalDelta = to.y - from.y;
  const horizontalDelta = to.x - from.x;

  if (Direction.DirectionType.HORIZONTAL === directionType) {
    if (horizontalDelta >= 0) {
      return Direction.RIGHT;
    }

    return Direction.LEFT;
  }

  if (verticalDelta > 0) {
    return Direction.BOTTOM;
  }

  return Direction.TOP;
};

export { dragDirection, resizeDirection };
