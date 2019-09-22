import React, { CSSProperties } from 'react';
import Config from '../contexts/Config';

import { Vertical, Horizontal, FromCorner } from '../types';

interface PropTypes {
  vertical: Vertical;
  horizontal: Horizontal;
  onStartDrag: (from: FromCorner) => void;
}

const getVerticalPosition = (
  size: number,
  vertical: Vertical,
): CSSProperties => {
  if (Vertical.TOP === vertical) {
    return { top: -(size / 2) };
  }

  return { bottom: -(size / 2) };
};

const getHorizontalPosition = (
  size: number,
  horizontal: Horizontal,
): CSSProperties => {
  if (Horizontal.LEFT === horizontal) {
    return { left: -(size / 2) };
  }

  return { right: -(size / 2) };
};

const getPosition = (
  size: number,
  vertical: Vertical,
  horizontal: Horizontal,
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
