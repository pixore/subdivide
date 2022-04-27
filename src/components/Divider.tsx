import React from 'react';
import Config from '../contexts/Config';

import { DirectionType } from '../utils/Direction';
import Percentage from '../utils/Percentage';
import { Emitter } from '../types';

interface PropTypes {
  id: string;
  previous: number;
  next: number;
  top: number;
  left: number;
  width: number;
  height: number;
  directionType: DirectionType;
  emitter: Emitter;
}

const getBarStyle = (isHorizontal: boolean): React.CSSProperties => {
  if (isHorizontal) {
    return {
      top: 0,
      width: 10,
      left: -5,
      height: '100%',
    };
  }

  return {
    left: 0,
    height: 10,
    top: -5,
    width: '100%',
  };
};

const Divider: React.FC<PropTypes> = (props) => {
  const { top, left, width, height, previous, next, directionType, emitter } =
    props;
  const { divider, verticalDivider, horizontalDivider } =
    Config.useClassNames();
  const isHorizontal = directionType === DirectionType.HORIZONTAL;
  const style: React.CSSProperties = {
    position: 'absolute',
    top: Percentage.toString(top),
    left: Percentage.toString(left),
    width: Percentage.toString(width),
    height: Percentage.toString(height),
  };

  const onMouseDown = (event: React.MouseEvent) => {
    emitter.emit('resize', {
      previous,
      next,
      from: {
        x: event.clientX,
        y: event.clientY,
        directionType,
      },
    });
  };

  const classNames = `${divider} ${
    directionType === DirectionType.HORIZONTAL
      ? horizontalDivider
      : verticalDivider
  }`;

  const barStyle: React.CSSProperties = {
    position: 'absolute',
    ...getBarStyle(isHorizontal),
  };

  return (
    <div className={classNames} onMouseDown={onMouseDown} style={style}>
      <div style={barStyle}></div>
    </div>
  );
};

export default Divider;
