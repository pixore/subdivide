import Direction, { OptionalDirection, DirectionType } from './utils/Direction';
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

const numberIsBetween = (
  value: number,
  top: number,
  bottom: number,
): boolean => {
  return top > value && value > bottom;
};

const dragDirection = (
  from: FromCorner,
  to: Position,
  splitRatio: number,
): OptionalDirection => {
  const verticalDelta = getVerticalDelta(from.vertical, from.y, to.y);
  const horizontalDelta = getHorizontalDelta(from.horizontal, from.x, to.x);

  if (
    numberIsBetween(verticalDelta, splitRatio, -splitRatio) &&
    numberIsBetween(horizontalDelta, splitRatio, -splitRatio)
  ) {
    return;
  }

  if (Math.abs(verticalDelta) > Math.abs(horizontalDelta)) {
    if (verticalDelta > 0) {
      return Direction.getOpposite(from.vertical);
    }
    return from.vertical;
  }

  if (horizontalDelta > 0) {
    return Direction.getOpposite(from.horizontal);
  }

  return from.horizontal;
};

const resizeDirection = (
  from: FromDivider,
  to: Position,
  directionType: DirectionType,
): Direction => {
  const verticalDelta = to.y - from.y;
  const horizontalDelta = to.x - from.x;

  if (DirectionType.HORIZONTAL === directionType) {
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

type EventHandler = (event: MouseEvent) => void;

const addMouseListener = (
  onMouseMove: EventHandler,
  onMouseUp: EventHandler,
) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

const removeMouseListener = (
  onMouseMove: EventHandler,
  onMouseUp: EventHandler,
) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

export {
  numberIsBetween,
  dragDirection,
  resizeDirection,
  addMouseListener,
  removeMouseListener,
};
