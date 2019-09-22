import { Horizontal, Vertical } from './types';

interface Corner {
  vertical: Vertical;
  horizontal: Horizontal;
}

interface Position {
  x: number;
  y: number;
}

export type Direction = Vertical | Horizontal | undefined;

const getVerticalDelta = (vertical: Vertical, fromX: number, toX: number) => {
  if (vertical === Vertical.TOP) {
    return toX - fromX;
  } else {
    return fromX - toX;
  }
};

const getHorizontalDelta = (
  horizontal: Horizontal,
  fromY: number,
  toY: number,
) => {
  if (horizontal === Horizontal.LEFT) {
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
): Direction => {
  const verticalDelta = getVerticalDelta(corner.vertical, from.y, to.y);
  const horizontalDelta = getHorizontalDelta(corner.horizontal, from.x, to.x);

  if (verticalDelta > horizontalDelta) {
    if (verticalDelta > splitRatio) {
      return corner.vertical === Vertical.TOP ? Vertical.BOTTOM : Vertical.TOP;
    }
    return undefined;
  } else {
    if (horizontalDelta > splitRatio) {
      return corner.horizontal === Horizontal.LEFT
        ? Horizontal.RIGHT
        : Horizontal.LEFT;
    }
    return undefined;
  }
};

export { dragDirection };
