import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Container from './Container';
import Divider from './Divider';
import { Emitter, Component } from '../types';
import Layout from '../layout';
import Overlay from './Overlay';
import Config from '../contexts/Config';
import { addId } from '../utils/Id';

interface PropTypes {
  component: Component;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
  selfPosition?: boolean;
}

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component, width, height, top, left, selfPosition = true } = props;
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);
  const { onLayoutChange, initialState, classNames } = Config.useConfig();
  const [layoutRef, actions] = Layout.useLayout(emitter, {
    onLayoutChange,
    initialState,
    size: {
      width,
      height,
    },
    position: {
      top,
      left,
    },
  });

  const { dividers, containers, overlay, layout } = layoutRef.current;

  const overlayElement = overlay.show ? <Overlay {...overlay} /> : null;

  React.useEffect(() => {
    if (initialState) {
      Object.keys(initialState.containers).forEach((id) => {
        addId(Number(id));
      });
    }
  }, []);

  const style: React.CSSProperties = {
    width: layout.width || '100%',
    height: layout.height || '100%',
    position: 'absolute',
  };

  if (selfPosition) {
    style.top = layout.top;
    style.left = layout.left;
  }

  const setContainerState = React.useCallback(
    (id: number, state: unknown) => {
      actions.update({
        id,
        state,
      });
    },
    [actions],
  );

  return (
    <div style={style} className={classNames.layout}>
      {Object.keys(containers).reduce<React.ReactNode[]>(
        (elements, id: string) => {
          const container = containers[id];

          if (container.isGroup) {
            return elements;
          }

          return elements.concat(
            <Container
              key={id}
              setState={setContainerState}
              emitter={emitter}
              component={component}
              {...container}
            />,
          );
        },
        [],
      )}
      {Object.keys(dividers).map((id) => {
        const divider = dividers[id];
        return <Divider {...divider} emitter={emitter} key={divider.id} />;
      })}
      {overlayElement}
    </div>
  );
};

export default Subdivide;
