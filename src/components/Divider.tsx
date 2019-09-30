import React from 'react';
import Config from '../contexts/Config';

import Direction from '../utils/Direction';
import Id from '../utils/Id';
import Percentage from '../utils/Percentage';
import { Emitter } from '../types';

interface PropTypes {
  id: number;
  previous: Id;
  next: Id;
  top: number;
  left: number;
  width: number;
  height: number;
  directionType: Direction.DirectionType;
  emitter: Emitter;
}

const Divider: React.FC<PropTypes> = (props) => {
  const {
    id,
    top,
    left,
    width,
    height,
    previous,
    next,
    directionType,
    emitter,
  } = props;
  const {
    divider,
    verticalDivider,
    horizontalDivider,
  } = Config.useClassNames();
  const style: React.CSSProperties = {
    top: Percentage.toString(top),
    left: Percentage.toString(left),
    width: Percentage.toString(width),
    height: Percentage.toString(height),
  };

  const onMouseDown = (event: React.MouseEvent) => {
    emitter.emit('resize', {
      previous,
      next,
      dividerId: id,
      from: {
        x: event.clientX,
        y: event.clientY,
        directionType,
      },
    });
  };

  const classNames = `${divider} ${
    directionType === Direction.DirectionType.HORIZONTAL
      ? horizontalDivider
      : verticalDivider
  }`;

  return (
    <div className={classNames} onMouseDown={onMouseDown} style={style}>
      <div></div>
    </div>
  );
};

export default Divider;
