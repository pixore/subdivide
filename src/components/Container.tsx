import React from 'react';

import Config from '../contexts/Config';
import Corner from './Corner';
import Direction from '../utils/Direction';
import { FromCorner, Emitter } from '../types';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';

type Component = React.ComponentType<any>;

interface PropTypes {
  emitter: Emitter;
  component: Component;
  id: Id;
  index: number;
  height: number;
  width: number;
  top: number;
  left: number;
  previous?: number;
  next?: number;
}

const Container: React.FC<PropTypes> = (props) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { container } = Config.useClassNames();
  const { index, component: Comp, width, height, top, left, emitter } = props;
  const style: React.CSSProperties = {
    width: Percentage.toString(width),
    height: Percentage.toString(height),
    top: Percentage.toString(top),
    left: Percentage.toString(left),
  };

  const onStartDrag = (fromCorner: FromCorner) => {
    emitter.emit('split', {
      containerIndex: index,
      from: fromCorner,
    });
  };

  return (
    <div ref={elementRef} className={container} style={style}>
      <Comp />
      <Corner
        onStartDrag={onStartDrag}
        vertical={Direction.TOP}
        horizontal={Direction.LEFT}
      />
      <Corner
        onStartDrag={onStartDrag}
        vertical={Direction.TOP}
        horizontal={Direction.RIGHT}
      />
      <Corner
        onStartDrag={onStartDrag}
        vertical={Direction.BOTTOM}
        horizontal={Direction.RIGHT}
      />
      <Corner
        onStartDrag={onStartDrag}
        vertical={Direction.BOTTOM}
        horizontal={Direction.LEFT}
      />
    </div>
  );
};

export default Container;
