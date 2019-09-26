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
  originContainer: ContainerDataUpdate,
  newContainer: NewContainerData,
}

const split = (
  container: ContainerData,
  to: Vector,
  direction: Direction,
): SplitResult => {
  const isVertical = Direction.isVertical(direction);
  const { top, left, width, height } = Container.toPixels(container);
  const deltaX =
    direction === Direction.RIGHT ? to.x - left : left + width - to.x;
  const deltaY =
    direction === Direction.BOTTOM ? to.y - top : top + height - to.y;
  const splitRatioPercentage = {
    horizontal: Percentage.create(window.innerWidth, deltaX),
    vertical: Percentage.create(window.innerHeight, deltaY),
  };

  const updateData: ContainerData = {
    ...container,
    ...Container.getSizeAfterSplit(
      container,
      splitRatioPercentage,
      isVertical,
    ),
    ...Container.getPositionAfterSplit(
      container,
      splitRatioPercentage,
      direction,
    ),
  };

  const newData: NewContainerData = {
    ...Container.getSizeAfterSplitFrom(
      updateData,
      splitRatioPercentage,
      isVertical,
    ),
    ...Container.getPositionAfterSplitFrom(container, updateData, direction),
  };

  const id = Id.create();

  return {
    originContainer: updateData,
    newContainer: addId(id, newData),
  }
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
