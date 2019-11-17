import Direction, { DirectionType } from '../utils/Direction';
import Vector from './Vector';
import Arr from './Arr';
import Id from './Id';
import { State } from '../layout/types';
import { FromCorner, DeepReadonly, Size } from '../types';

interface MutableContainer {
  id: Id;
  parent: Id;
  children: Id[];
  directionType?: DirectionType;
  splitRatio: number;
  isGroup: boolean;
  width: number;
  height: number;
  top: number;
  left: number;
}

type Container = DeepReadonly<MutableContainer>;

interface OptionalSizeAndPosition {
  id: Id;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

interface Delta {
  x: number;
  y: number;
}

interface SizeAndPosition {
  id: Id;
  width: number;
  height: number;
  top: number;
  left: number;
}

const getSizeAndPositionFromDelta = (
  item: SizeAndPosition,
  delta: Delta,
  isPrevious: boolean,
  direction: Direction,
): OptionalSizeAndPosition => {
  const { id, height, width, top, left } = item;

  if (Direction.isVertical(direction)) {
    if (isPrevious) {
      return {
        id,
        height: height + delta.y,
      };
    }

    return {
      id,
      top: top + delta.y,
      height: height - delta.y,
    };
  }

  if (isPrevious) {
    return {
      id,
      width: width + delta.x,
    };
  }
  return {
    id,
    left: left + delta.x,
    width: width - delta.x,
  };
};

const getSizeAfterSplit = (
  container: Container,
  delta: Vector,
  direction: Direction,
): Size => {
  const isVertical = Direction.isVertical(direction);
  const isForward = Direction.isForward(direction);
  const { width, height } = container;
  const sizeVector = Vector.fromSize(container);
  const newSize = isForward
    ? Vector.subtract(sizeVector, delta)
    : Vector.add(sizeVector, delta);

  if (isVertical) {
    return {
      width,
      height: newSize.y,
    };
  }

  return {
    width: newSize.x,
    height,
  };
};

const getSizeAfterSplitFrom = (
  container: Container,
  delta: Vector,
  direction: Direction,
): Size => {
  const isVertical = Direction.isVertical(direction);
  const isForward = Direction.isForward(direction);
  const { width, height } = container;
  const newSize = isForward ? delta : Vector.invert(delta);

  if (isVertical) {
    return {
      width,
      height: newSize.y,
    };
  }

  return {
    width: newSize.x,
    height,
  };
};

interface UpdatePosition {
  top?: number;
  left?: number;
}

interface NewPosition {
  top: number;
  left: number;
}

const getPositionAfterSplit = (
  container: Container,
  delta: Vector,
  direction?: Direction,
): UpdatePosition => {
  const { top, left } = container;

  if (direction === Direction.BOTTOM) {
    return {
      top: top + delta.y,
    };
  }
  if (direction === Direction.RIGHT) {
    return {
      left: left + delta.x,
    };
  }

  return {};
};

const getPositionAfterSplitFrom = (
  container: Container,
  updatedContainer: Container,
  direction?: Direction,
): NewPosition => {
  const { top, left } = container;
  const { height, width } = updatedContainer;
  if (direction === Direction.BOTTOM || direction === Direction.RIGHT) {
    return {
      top,
      left,
    };
  }

  if (direction === Direction.TOP) {
    return {
      top: top + height,
      left: left,
    };
  }

  return {
    top,
    left: left + width,
  };
};

interface SplitResult {
  previous: Container;
  next: Container;
  parent: Container;
  rootId?: Id;
}

const newGroupIsNeeded = (
  direction: Direction,
  parent: Container | undefined,
) => {
  const directionType = Direction.getType(direction);

  if (!parent) {
    return true;
  }

  return parent.directionType !== directionType;
};

const getDelta = (container: Container, from: FromCorner, to: Vector) => {
  const { left, width, top, height } = container;

  return {
    x: from.horizontal === Direction.LEFT ? to.x - left : to.x - (left + width),
    y: from.vertical === Direction.TOP ? to.y - top : to.y - (top + height),
  };
};

const createContainer = (
  id: Id,
  direction: Direction,
  delta: Vector,
  splitRatio: number,
  originContainer: Container,
  updatedOriginContainer: Container,
): Container => {
  return {
    id,
    parent: updatedOriginContainer.parent,
    isGroup: false,
    splitRatio,
    children: [],
    ...getSizeAfterSplitFrom(updatedOriginContainer, delta, direction),
    ...getPositionAfterSplitFrom(
      originContainer,
      updatedOriginContainer,
      direction,
    ),
  };
};

const getSplitRatio = (
  splitRatio: number,
  splitDelta: Vector,
  direction: Direction,
  isPrevious: boolean,
) => {
  const isVertical = Direction.isVertical(direction);

  if (isPrevious) {
    if (isVertical) {
      return splitRatio + splitDelta.y;
    }

    return splitRatio + splitDelta.x;
  }

  if (isVertical) {
    return splitRatio - splitDelta.y;
  }

  return splitRatio - splitDelta.x;
};

const createGroup = (
  container: Container,
  directionType: DirectionType,
  children: Id[],
) => {
  return {
    ...container,
    id: Id.create(),
    isGroup: true,
    children,
    directionType,
  };
};

const getSplitOrder = (
  originContainerId: Id,
  newContainerId: Id,
  isForward: boolean,
) => {
  if (isForward) {
    return {
      prev: newContainerId,
      next: originContainerId,
    };
  }
  return {
    prev: originContainerId,
    next: newContainerId,
  };
};

const split = (
  originContainerId: Id,
  layout: State,
  direction: Direction,
  delta: Vector,
): SplitResult => {
  const { containers, rootId } = layout;
  const originContainer = containers[originContainerId];
  const newContainerId = Id.create();
  const isForward = Direction.isForward(direction);
  const directionType = Direction.getType(direction);

  const order = getSplitOrder(originContainerId, newContainerId, isForward);
  const arrOrder = [order.prev, order.next];

  const getParent = (container: Container): Container => {
    const parent = containers[container.parent];

    if (newGroupIsNeeded(direction, parent)) {
      return createGroup(container, directionType, arrOrder);
    }

    const children = Arr.replaceItem(
      parent.children,
      originContainer.id,
      arrOrder,
    );

    return {
      ...parent,
      children,
    };
  };

  const parent = getParent(originContainer);
  const isNewParent = parent.id !== originContainer.parent;

  const splitDelta = Vector.ofPercentage(delta, Vector.fromSize(parent));

  const baseSplitRatio = isNewParent ? 100 : originContainer.splitRatio;

  const updateData: Container = {
    ...originContainer,
    splitRatio: getSplitRatio(
      baseSplitRatio,
      splitDelta,
      direction,
      !isForward,
    ),
    parent: parent.id,
    ...getSizeAfterSplit(originContainer, delta, direction),
    ...getPositionAfterSplit(originContainer, delta, direction),
  };

  const newData = createContainer(
    newContainerId,
    direction,
    delta,
    getSplitRatio(0, splitDelta, direction, isForward),
    originContainer,
    updateData,
  );

  return {
    rootId: originContainer.id === rootId ? parent.id : undefined,
    previous: isForward ? newData : updateData,
    next: isForward ? updateData : newData,
    parent,
  };
};

const Container = {
  split,
  getDelta,
  getSplitRatio,
  getSizeAfterSplit,
  getSizeAfterSplitFrom,
  getPositionAfterSplit,
  getPositionAfterSplitFrom,
  getSizeAndPositionFromDelta,
};

export default Container;
