import React, { CSSProperties } from 'react';
import Config from '../contexts/Config';

import { FromCorner } from '../types';
import Direction from '../utils/Direction';

interface PropTypes {
  vertical: Direction;
  horizontal: Direction;
  onStartDrag: (from: FromCorner) => void;
}

const getVerticalPosition = (
  size: number,
  vertical: Direction,
): CSSProperties => {
  if (Direction.TOP === vertical) {
    return { top: -(size / 2) };
  }

  return { bottom: -(size / 2) };
};

const getHorizontalPosition = (
  size: number,
  horizontal: Direction,
): CSSProperties => {
  if (Direction.LEFT === horizontal) {
    return { left: -(size / 2) };
  }

  return { right: -(size / 2) };
};

const getPosition = (
  size: number,
  vertical: Direction,
  horizontal: Direction,
): CSSProperties => {
  return {
    ...getVerticalPosition(size, vertical),
    ...getHorizontalPosition(size, horizontal),
  };
};

const Corner: React.FC<PropTypes> = (props) => {
  const { vertical, horizontal, onStartDrag } = props;
  const { cornerSize } = Config.useConfig();
  const { corner } = Config.useClassNames();
  const style = {
    ...getPosition(cornerSize, vertical, horizontal),
    width: cornerSize,
    height: cornerSize,
  };

  const onMouseDown = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    onStartDrag({
      vertical,
      horizontal,
      x: clientX,
      y: clientY,
    });
  };

  return <div onMouseDown={onMouseDown} style={style} className={corner}></div>;
};

export default Corner;
