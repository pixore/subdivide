import * as React from 'react';

import Config from '../contexts/Config';
import Corner from './Corner';
import Direction from '../utils/Direction';
import { FromCorner, Emitter, Component } from '../types';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';

interface PropTypes {
  emitter: Emitter;
  component: Component;
  id: Id;
  height: number;
  width: number;
  top: number;
  left: number;
  previous?: number;
  next?: number;
  state?: unknown;
  setState: (id: Id, state: unknown) => void;
}

interface State {
  id: number;
  setState: (state: unknown) => void;
  state: unknown;
}

const Context = React.createContext<State>({
  id: -1,
  setState: () => undefined,
  state: {},
});

const Container: React.FC<PropTypes> = (props) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { container } = Config.useClassNames();
  const {
    id,
    component: Comp,
    width,
    height,
    top,
    left,
    emitter,
    state,
    setState,
  } = props;
  const style: React.CSSProperties = {
    position: 'absolute',
    overflow: 'hidden',
    width: Percentage.toString(width),
    height: Percentage.toString(height),
    top: Percentage.toString(top),
    left: Percentage.toString(left),
  };

  const onStartDrag = (fromCorner: FromCorner) => {
    emitter.emit('cornerDrag', {
      containerId: id,
      from: fromCorner,
    });
  };

  const value = {
    id,
    setState: (state: unknown) => {
      setState(id, state);
    },
    state,
  };

  return (
    <div ref={elementRef} className={container} style={style}>
      <Context.Provider value={value}>
        <Comp />
      </Context.Provider>
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

const useContainer = () => React.useContext(Context);

export { useContainer };

export default Container;
