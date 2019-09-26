import Direction from '../utils/Direction';
import { ContainerData } from '../types';

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

const Container = {
  getSizeAfterSplit,
  getSizeAfterSplitFrom,
  getPositionAfterSplit,
  getPositionAfterSplitFrom,
  getSizeAndPositionFromDelta,
};

export default Container;
