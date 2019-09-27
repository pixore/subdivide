import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import once from 'once';
import Con from './Container';
import Direction from '../utils/Direction';
import { dragDirection } from '../utils';
import Hooks from '../hooks';
import Config from '../contexts/Config';
import Percentage from '../utils/Percentage';
import Container from '../utils/Container';
import { Emitter, SplitArgs } from '../types';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const { splitRatio } = Config.useConfig();
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);

  const [map, actions, actionCreators] = Hooks.useContainers();
  const mapRef = React.useRef(map);
  const actionsRef = React.useRef(actions);

  mapRef.current = map;
  actionsRef.current = actions;

  React.useEffect(() => {
    const onStartSplit = (args: SplitArgs) => {
      const { containerId, from } = args;

      let direction: Direction | undefined;
      let newContainerId: number | undefined;

      const onceSplit = once(Container.split);
      const onMouseMove = (event: MouseEvent) => {
        const container = mapRef.current[containerId];
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        if (!direction) {
          direction = dragDirection(from, to, splitRatio);
          if (direction) {
            const {
              originContainer,
              newContainer,
              nextContainer,
              previousContainer,
            } = onceSplit(container, to, direction);
            newContainerId = newContainer.id;
            const actions = [
              actionCreators.update(originContainer),
              actionCreators.add(newContainer),
            ];

            if (nextContainer) {
              actions.push(actionCreators.update(nextContainer));
            }

            if (previousContainer) {
              actions.push(actionCreators.update(previousContainer));
            }

            actionsRef.current.batch(actions);

            from.x = to.x;
            from.y = to.y;
          }
          return;
        }

        if (!newContainerId) {
          return;
        }

        const newContainer = mapRef.current[newContainerId];

        const delta = {
          x: Percentage.create(window.innerWidth, to.x - from.x),
          y: Percentage.create(window.innerHeight, to.y - from.y),
        };

        const originalContainerData = actionCreators.update(
          Container.addId(
            containerId,
            Container.getSizeAndPositionFromDelta(container, delta, direction),
          ),
        );

        const newContainerData = actionCreators.update(
          Container.addId(
            newContainerId,
            Container.getSizeAndPositionFromDelta(
              newContainer,
              delta,
              Direction.getOpposite(direction),
            ),
          ),
        );

        actionsRef.current.batch([originalContainerData, newContainerData]);

        if (direction) {
          from.x = to.x;
          from.y = to.y;
        }
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };

    emitter.on('split', onStartSplit);

    return () => {
      emitter.off('split', onStartSplit);
    };
  }, []);

  return (
    <>
      {Object.keys(map).map((key, index) => {
        const item = map[key];
        const { id } = item;

        return (
          <Con
            key={id}
            emitter={emitter}
            component={component}
            index={index}
            {...item}
          />
        );
      })}
    </>
  );
};

export default Subdivide;
