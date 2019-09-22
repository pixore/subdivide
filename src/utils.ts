import Direction, { OptionalDirection } from './utils/Direction';

interface Corner {
  vertical: Direction;
  horizontal: Direction;
}

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
  corner: Corner,
  from: Position,
  to: Position,
  splitRatio: number,
): OptionalDirection => {
  const verticalDelta = getVerticalDelta(corner.vertical, from.y, to.y);
  const horizontalDelta = getHorizontalDelta(corner.horizontal, from.x, to.x);

  if (verticalDelta > horizontalDelta) {
    if (verticalDelta > splitRatio) {
      return Direction.getOpposite(corner.vertical);
    }
    return undefined;
  } else {
    if (horizontalDelta > splitRatio) {
      return Direction.getOpposite(corner.horizontal);
    }
    return undefined;
  }
};

export { dragDirection };
