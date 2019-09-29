import React from 'react';
import Config from '../contexts/Config';

import Direction from '../utils/Direction';
import Id from '../utils/Id';
import Percentage from '../utils/Percentage';
import { Emitter } from '../types';

interface PropTypes {
  previous: Id[];
  next: Id[];
  top: number;
  left: number;
  width: number;
  height: number;
  directionType: Direction.DirectionType;
  emitter: Emitter;
}

const Divider: React.FC<PropTypes> = (props) => {
  const {
    top,
    left,
    width,
    height,
    previous,
    next,
    directionType,
    emitter,
  } = props;
  const { divider } = Config.useClassNames();
  const style: React.CSSProperties = {
    top: Percentage.toString(top),
    left: Percentage.toString(left),
    width: Percentage.toString(width),
    height: Percentage.toString(height),
  };

  const onMouseDown = (event: React.MouseEvent) => {
    emitter.emit('resize', {
      previous: previous[0],
      next: next[0],
      from: {
        x: event.clientX,
        y: event.clientY,
        directionType,
      },
    });
  };

  return (
    <div className={divider} onMouseDown={onMouseDown} style={style}></div>
  );
};

export default Divider;
