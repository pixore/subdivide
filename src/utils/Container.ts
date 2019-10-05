import Direction from '../utils/Direction';
import Percentage from './Percentage';
import Id from './Id';
import { ReadOnlyState } from '../hooks/useLayout/types';
import { ContainerData, Vector, FromCorner } from '../types';

interface OptionalSizeAndPosition {
  id: Id;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}
interface Size {
  width: number;
  height: number;
}
interface Delta {
  x: number;
  y: number;
}

const toPixels = (container: ContainerData): ContainerData => {
  const { top, left, width, height } = container;
  return {
    ...container,
    top: Percentage.toPixels(window.innerHeight, top),
    left: Percentage.toPixels(window.innerWidth, left),
    width: Percentage.toPixels(window.innerWidth, width),
    height: Percentage.toPixels(window.innerHeight, height),
  };
};

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
  container: ContainerData,
  delta: Vector,
  direction: Direction,
): Size => {
  const isVertical = Direction.isVertical(direction);
  const isForward = Direction.isForward(direction);
  const { width, height } = container;

  if (isVertical) {
    return {
      width,
      height: isForward ? height - delta.y : height + delta.y,
    };
  }

  return {
    width: isForward ? width - delta.x : width + delta.x,
    height,
  };
};

const getSizeAfterSplitFrom = (
  container: ContainerData,
  delta: Vector,
  direction: Direction,
): Size => {
  const isVertical = Direction.isVertical(direction);
  const isForward = Direction.isForward(direction);
  const { width, height } = container;

  if (isVertical) {
    return {
      width,
      height: isForward ? delta.y : -delta.y,
    };
  }

  return {
    width: isForward ? delta.x : -delta.x,
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
  container: ContainerData,
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
  container: ContainerData,
  updatedContainer: ContainerData,
  direction?: Direction,
): NewPosition => {
  const { top, left } = container;
  const { height, width } = updatedContainer;
  if (direction === Direction.BOTTOM) {
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

  if (direction === Direction.RIGHT) {
    return {
      top,
      left,
    };
  }

  return {
    top,
    left: left + width,
  };
};

interface SplitResult {
  previous: ContainerData;
  next: ContainerData;
  parent: ContainerData;
  rootId?: Id;
}

const newGroupIsNeeded = (
  direction: Direction,
  parent: ContainerData | undefined,
) => {
  const directionType = Direction.getType(direction);

  if (!parent) {
    return true;
  }

  return parent.directionType !== directionType;
};

const getDelta = (container: ContainerData, from: FromCorner, to: Vector) => {
  const { left, width, top, height } = Container.toPixels(container);

  return {
    x: Percentage.create(
      window.innerWidth,
      from.horizontal === Direction.LEFT ? to.x - left : to.x - (left + width),
    ),
    y: Percentage.create(
      window.innerHeight,
      from.vertical === Direction.TOP ? to.y - top : to.y - (top + height),
    ),
  };
};

const createContainer = (
  id: Id,
  direction: Direction,
  delta: Vector,
  splitRatio: number,
  originContainer: ContainerData,
  updatedOriginContainer: ContainerData,
): ContainerData => {
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

const split = (
  originContainerId: Id,
  layout: ReadOnlyState,
  direction: Direction,
  delta: Vector,
): SplitResult => {
  const { containers, rootId } = layout;
  const originContainer = containers[originContainerId] as ContainerData;
  const newContainerId = Id.create();
  const isForward = Direction.isForward(direction);
  const directionType = Direction.getType(direction);

  const getParent = (container: ContainerData): ContainerData => {
    const parent = containers[container.parent] as ContainerData;
    if (newGroupIsNeeded(direction, parent)) {
      return {
        ...container,
        id: Id.create(),
        isGroup: true,
        children: isForward
          ? [newContainerId, container.id]
          : [container.id, newContainerId],
        directionType,
      };
    }

    const index = parent.children.indexOf(originContainer.id);
    const children: Id[] = [...parent.children.slice(0, index)];
    if (isForward) {
      console.log(newContainerId, originContainer.id);

      children.push(newContainerId, originContainer.id);
    } else {
      console.log(originContainer.id, newContainerId);

      children.push(originContainer.id, newContainerId);
    }
    children.push(...parent.children.slice(index + 1));

    return {
      ...parent,
      children,
    };
  };

  const parent = getParent(originContainer);

  const splitDelta: Vector = {
    x: Percentage.ofPercentage(delta.x, parent.width),
    y: Percentage.ofPercentage(delta.y, parent.height),
  };

  const splitRatio =
    parent.id === originContainer.parent ? originContainer.splitRatio : 100;

  const updateData: ContainerData = {
    ...originContainer,
    splitRatio: getSplitRatio(
      splitRatio,
      splitDelta,
      direction,
      isForward ? false : true,
    ),
    parent: parent.id,
    ...getSizeAfterSplit(originContainer, delta, direction),
    ...getPositionAfterSplit(originContainer, delta, direction),
  };

  const newData = createContainer(
    newContainerId,
    direction,
    delta,
    getSplitRatio(0, splitDelta, direction, isForward ? true : false),
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
  toPixels,
  getSplitRatio,
  getSizeAfterSplit,
  getSizeAfterSplitFrom,
  getPositionAfterSplit,
  getPositionAfterSplitFrom,
  getSizeAndPositionFromDelta,
};

export default Container;
