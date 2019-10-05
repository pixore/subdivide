enum Direction {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export type OptionalDirection = Direction | undefined;

export enum DirectionType {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}

namespace Direction {
  /**
   * I couldn't come up with a better name (programming ¯\_(ツ)_/¯) for this,
   * but this represent left and bottom directions which are the directions
   * that don't require change the left or top properties, just width and height.
   */
  export const isBackward = (direction: Direction): boolean => {
    return direction === Direction.LEFT || direction === Direction.TOP;
  };

  export const isForward = (direction: Direction): boolean =>
    !isBackward(direction);

  export const isVertical = (direction: OptionalDirection): boolean => {
    return direction === Direction.TOP || direction === Direction.BOTTOM;
  };

  export const isHorizontal = (direction: OptionalDirection): boolean => {
    return !isVertical(direction);
  };

  export const getType = (direction: Direction): DirectionType => {
    return isVertical(direction)
      ? DirectionType.VERTICAL
      : DirectionType.HORIZONTAL;
  };

  export const getOpposite = (direction: OptionalDirection) => {
    if (direction === Direction.TOP) {
      return Direction.BOTTOM;
    }

    if (direction === Direction.BOTTOM) {
      return Direction.TOP;
    }

    if (direction === Direction.LEFT) {
      return Direction.RIGHT;
    }

    return Direction.LEFT;
  };
}

export default Direction;
