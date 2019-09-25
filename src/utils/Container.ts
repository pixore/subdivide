import Direction from '../utils/Direction';
import { ContainerData } from '../types';

interface Size {
  width: number;
  height: number;
}

interface SplitRatioPercentage {
  vertical: number;
  horizontal: number;
}

const getSize = (
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

const getSizeFrom = (
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

const getPosition = (
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

const getPositionFrom = (
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
  getSizeFrom,
  getPositionFrom,
  getSize,
  getPosition,
};

export default Container;
