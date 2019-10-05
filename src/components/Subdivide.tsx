import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Container from './Container';
import Divider from './Divider';
import { Emitter } from '../types';
import Layout from '../layout';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);
  const layout = Layout.useLayout();

  const [layoutRef] = layout;

  Layout.useResize(layout, emitter);
  Layout.useSplit(layout, emitter);

  const { dividers, containers } = layoutRef.current;

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
    </>
  );
};

export default Subdivide;
