import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Container from './Container';
import Divider from './Divider';
import useLayout from '../hooks/useLayout';
import { Emitter, Group } from '../types';
import useResize from '../hooks/useResize';
import useSplit from '../hooks/useSplit';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);
  const layout = useLayout();

  const [layoutRef] = layout;

  useResize(layout, emitter);
  useSplit(layout, emitter);

  const { dividers, containers } = layoutRef.current;

  return (
    <>
      {Object.keys(containers).map((key) => {
        const item = containers[key];
        const { id } = item;

        return (
          <Container
            key={id}
            emitter={emitter}
            component={component}
            {...item}
          />
        );
      })}
      {Object.keys(dividers).map((id) => {
        const divider = dividers[id];
        return <Divider {...divider} emitter={emitter} key={divider.id} />;
      })}
    </>
  );
};

export default Subdivide;
