import Direction from '../utils/Direction';
import Percentage from './Percentage';
import Id from './Id';
import { ContainerData, NewContainerData, ContainerDataUpdate } from '../types';

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
interface SplitRatioPercentage {
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
  direction?: Direction,
): OptionalSizeAndPosition => {
  const { height, width, top, left } = container;
  if (direction === Direction.TOP) {
    return {
      height: height + delta.y,
    };
  }

  if (direction === Direction.BOTTOM) {
    return {
      top: top + delta.y,
      height: height - delta.y,
    };
  }

  if (direction === Direction.LEFT) {
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
  splitRatio: SplitRatioPercentage,
  isVertical: boolean,
): Size => {
  const { width, height } = container;
  if (isVertical) {
    return {
      width,
      height: height - splitRatio.vertical,
    };
  }

  return {
    width: width - splitRatio.horizontal,
    height,
  };
};

const getSizeAfterSplitFrom = (
  container: ContainerData,
  splitRatio: SplitRatioPercentage,
  isVertical: boolean,
): Size => {
  const { width, height } = container;
  if (isVertical) {
    return {
      width,
      height: splitRatio.vertical,
    };
  }

  return {
    width: splitRatio.horizontal,
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
  splitRatio: SplitRatioPercentage,
  direction?: Direction,
): UpdatePosition => {
  const { top, left } = container;
  if (direction === Direction.BOTTOM) {
    return {
      top: top + splitRatio.vertical,
    };
  }
  if (direction === Direction.RIGHT) {
    return {
      left: left + splitRatio.horizontal,
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
  newContainer: NewContainerData;
  nextContainer?: ContainerDataUpdate;
  previousContainer?: ContainerDataUpdate;
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
  previousContainer?: ContainerDataUpdate;
  newContainer: ContainerDataUpdate;
  originContainer: ContainerDataUpdate;
  nextContainer?: ContainerDataUpdate;
}

const getAdjacentContainers = (
  container: ContainerData,
  newId: Id,
  direction: Direction,
): AdjacentContainerUpdate => {
  const { previous, next } = container;
  const newDirectiontType = Direction.getType(direction);
  const isSameDirectionType = newDirectiontType === container.directionType;
  console.log(isSameDirectionType, Direction.isForward(direction));

  if (Direction.isForward(direction)) {
    const update: AdjacentContainerUpdate = {
      newContainer: {
        id: newId,
        previous: isSameDirectionType ? previous : undefined,
        next: container.id,
      },
      originContainer: {
        id: container.id,
        previous: newId,
        next: isSameDirectionType ? next : undefined,
      },
    };

    if (typeof previous === 'number') {
      update.previousContainer = {
        id: previous,
        next: isSameDirectionType ? newId : undefined,
      };
    }

    return update;
  }

  const update: AdjacentContainerUpdate = {
    originContainer: {
      id: container.id,
      previous: isSameDirectionType ? previous : undefined,
      next: newId,
    },
    newContainer: {
      id: newId,
      previous: container.id,
      next,
    },
  };

  if (typeof next === 'number') {
    update.nextContainer = {
      id: next,
      previous: isSameDirectionType ? newId : undefined,
    };
  }

  if (typeof previous === 'number' && !isSameDirectionType) {
    update.previousContainer = {
      id: previous,
      next: undefined,
    };
  }

  return update;
};

const split = (
  container: ContainerData,
  to: Vector,
  direction: Direction,
): SplitResult => {
  const id = Id.create();
  const isVertical = Direction.isVertical(direction);
  const delta = getDelta(container, to, direction);

  const initialSize = {
    horizontal: Percentage.create(window.innerWidth, delta.x),
    vertical: Percentage.create(window.innerHeight, delta.y),
  };

  const adjacentsUpdate = getAdjacentContainers(container, id, direction);

  const { nextContainer, previousContainer } = adjacentsUpdate;

  const updateData: ContainerData = {
    ...container,
    directionType: Direction.getType(direction),
    ...adjacentsUpdate.originContainer,
    ...getSizeAfterSplit(container, initialSize, isVertical),
    ...getPositionAfterSplit(container, initialSize, direction),
  };

  const newData: NewContainerData = {
    id,
    directionType: Direction.getType(direction),
    ...adjacentsUpdate.newContainer,
    ...getSizeAfterSplitFrom(updateData, initialSize, isVertical),
    ...getPositionAfterSplitFrom(container, updateData, direction),
  };

  return {
    nextContainer,
    previousContainer,
    originContainer: updateData,
    newContainer: newData,
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
