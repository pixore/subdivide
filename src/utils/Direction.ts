enum Direction {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export type OptionalDirection = Direction | undefined;

namespace Direction {
  export const isVertical = (direction: OptionalDirection): boolean => {
    return direction === Direction.TOP || direction === Direction.BOTTOM;
  };

  export const isHorizontal = (direction: OptionalDirection): boolean => {
    return direction === Direction.LEFT || direction === Direction.RIGHT;
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
