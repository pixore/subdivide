import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Container from './Container';
import Divider from './Divider';
import { Emitter, Component, LayoutUpdate } from '../types';
import Layout from '../layout';
import Overlay from './Overlay';
import Config from '../contexts/Config';

interface PropTypes {
  component: Component;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component, width, height, top, left } = props;
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);
  const { onLayoutChange, initialState } = Config.useConfig();
  const layout = Layout.useLayout(emitter, {
    onLayoutChange,
    initialState,
  });

  const [layoutRef, actions] = layout;

  const { dividers, containers, overlay } = layoutRef.current;

  const overlayElement = overlay.show ? <Overlay {...overlay} /> : null;

  React.useEffect(() => {
    const { innerWidth, innerHeight } = window;
    const layoutUpdate: LayoutUpdate = {};

    layoutUpdate.width = width || innerWidth;
    layoutUpdate.height = height || innerHeight;
    layoutUpdate.top = top || 0;
    layoutUpdate.left = left || 0;

    actions.updateLayout(layoutUpdate);
  }, [width, height, top, left]);

  return (
    <>
      {Object.keys(containers).reduce<React.ReactNode[]>(
        (elements, id: string) => {
          const container = containers[id];

          if (container.isGroup) {
            return elements;
          }

          return elements.concat(
            <Container
              key={id}
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
    </>
  );
};

export default Subdivide;
