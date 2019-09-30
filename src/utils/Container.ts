import Direction from '../utils/Direction';
import Percentage from './Percentage';
import Id from './Id';
import { ContainerData, ContainerDataUpdate, DividerData } from '../types';
import { ReadOnlyState } from '../hooks/useLayout/types';

interface OptionalSizeAndPosition {
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}
interface Size {
  width: number;
  height: number;
}
interface InitialSize {
  vertical: number;
  horizontal: number;
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

const getSizeAndPositionFromDelta = (
  container: ContainerData,
  delta: Delta,
  isPrevious: boolean,
  direction: Direction,
): OptionalSizeAndPosition => {
  const { height, width, top, left } = container;

  if (Direction.isVertical(direction)) {
    if (isPrevious) {
      return {
        height: height + delta.y,
      };
    }

    return {
      top: top + delta.y,
      height: height - delta.y,
    };
  }

  if (isPrevious) {
    return {
      width: width + delta.x,
    };
  }
  return {
    left: left + delta.x,
    width: width - delta.x,
  };
};

const getSizeAfterSplit = (
  container: ContainerData,
  initialSize: InitialSize,
  isVertical: boolean,
): Size => {
  const { width, height } = container;
  if (isVertical) {
    return {
      width,
      height: height - initialSize.vertical,
    };
  }

  return {
    width: width - initialSize.horizontal,
    height,
  };
};

const getSizeAfterSplitFrom = (
  container: ContainerData,
  initialSize: InitialSize,
  isVertical: boolean,
): Size => {
  const { width, height } = container;
  if (isVertical) {
    return {
      width,
      height: initialSize.vertical,
    };
  }

  return {
    width: initialSize.horizontal,
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
  initialSize: InitialSize,
  direction?: Direction,
): UpdatePosition => {
  const { top, left } = container;
  if (direction === Direction.BOTTOM) {
    return {
      top: top + initialSize.vertical,
    };
  }
  if (direction === Direction.RIGHT) {
    return {
      left: left + initialSize.horizontal,
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

const addId = <T extends object>(id: Id, data: T): T & { id: Id } => {
  (data as T & { id: Id }).id = id;
  return data as T & { id: Id };
};

interface Vector {
  x: number;
  y: number;
}

interface SplitResult {
  originContainer: ContainerDataUpdate;
  newContainer: ContainerData;
  divider: DividerData;
}

const getDelta = (
  container: ContainerData,
  to: Vector,
  direction: Direction,
): Vector => {
  const { top, left, width, height } = toPixels(container);
  const bottom = top + height;
  const right = left + width;
  return {
    x: direction === Direction.LEFT ? right - to.x : to.x - left,
    y: direction === Direction.TOP ? bottom - to.y : to.y - top,
  };
};

interface AdjacentContainerUpdate {
  newContainer: ContainerDataUpdate;
  originContainer: ContainerDataUpdate;
  dividerId: Id;
}

const getAdjacentContainers = (
  container: ContainerData,
  newId: Id,
  direction: Direction,
): AdjacentContainerUpdate => {
  const dividerId = Id.create();
  const { previous, next } = container;
  const newDirectionType = Direction.getType(direction);
  const isSameDirectionType = newDirectionType === container.directionType;

  if (Direction.isForward(direction)) {
    return {
      dividerId,
      newContainer: {
        id: newId,
        previous: isSameDirectionType ? previous : undefined,
        next: dividerId,
      },
      originContainer: {
        id: container.id,
        previous: dividerId,
        next: isSameDirectionType ? next : undefined,
      },
    };
  }

  return {
    dividerId,
    originContainer: {
      id: container.id,
      previous: isSameDirectionType ? previous : undefined,
      next: dividerId,
    },
    newContainer: {
      id: newId,
      previous: dividerId,
      next,
    },
  };
};

const getDivider = (
  originContainer: ContainerData,
  newContainer: ContainerData,
  direction: Direction,
  id: Id,
): DividerData => {
  const directionType = Direction.getType(direction);
  const isVertical = Direction.isVertical(direction);
  const previous = Direction.isForward(direction)
    ? [newContainer.id]
    : [originContainer.id];
  const next = Direction.isForward(direction)
    ? [originContainer.id]
    : [newContainer.id];

  if (isVertical) {
    return {
      id,
      directionType,
      previous,
      next,
      width: originContainer.width,
      height: 0,
      left: originContainer.left,
      top: Direction.isForward(direction)
        ? newContainer.height + newContainer.top
        : originContainer.height + originContainer.top,
    };
  }

  return {
    id,
    directionType,
    previous,
    next,
    width: 0,
    height: originContainer.height,
    left: Direction.isForward(direction)
      ? newContainer.width + newContainer.left
      : originContainer.width + originContainer.top,
    top: originContainer.top,
  };
};

const split = (
  originContainerId: Id,
  layout: ReadOnlyState,
  direction: Direction,
  to: Vector,
): SplitResult => {
  const originContainer = layout.containers[originContainerId];
  const id = Id.create();
  const isVertical = Direction.isVertical(direction);
  const delta = getDelta(originContainer, to, direction);

  const initialSize = {
    horizontal: Percentage.create(window.innerWidth, delta.x),
    vertical: Percentage.create(window.innerHeight, delta.y),
  };

  const adjacentsUpdate = getAdjacentContainers(originContainer, id, direction);

  const { dividerId } = adjacentsUpdate;

  const updateData: ContainerData = {
    ...originContainer,
    directionType: Direction.getType(direction),
    ...adjacentsUpdate.originContainer,
    ...getSizeAfterSplit(originContainer, initialSize, isVertical),
    ...getPositionAfterSplit(originContainer, initialSize, direction),
  };

  const newData: ContainerData = {
    id,
    directionType: Direction.getType(direction),
    ...adjacentsUpdate.newContainer,
    ...getSizeAfterSplitFrom(updateData, initialSize, isVertical),
    ...getPositionAfterSplitFrom(originContainer, updateData, direction),
  };

  return {
    originContainer: updateData,
    newContainer: newData,
    divider: getDivider(updateData, newData, direction, dividerId),
  };
};

const Container = {
  addId,
  split,
  toPixels,
  getSizeAfterSplit,
  getSizeAfterSplitFrom,
  getPositionAfterSplit,
  getPositionAfterSplitFrom,
  getSizeAndPositionFromDelta,
};

export default Container;
