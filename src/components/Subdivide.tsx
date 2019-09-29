import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import once from 'once';
import Con from './Container';
import Divider from './Divider';
import Direction from '../utils/Direction';
import { dragDirection, resizeDirection } from '../utils';
import Hooks from '../hooks';
import Config from '../contexts/Config';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';
import Container from '../utils/Container';
import { Emitter, SplitArgs, DividerData, ResizeArgs } from '../types';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

type EventHandler = (event: MouseEvent) => void;

const addMouseListener = (
  onMouseMove: EventHandler,
  onMouseUp: EventHandler,
) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

const removeMouseListener = (
  onMouseMove: EventHandler,
  onMouseUp: EventHandler,
) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const { splitRatio } = Config.useConfig();
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);

  const [map, actions, actionCreators] = Hooks.useContainers();
  const [dividersRef, dividersActions] = Hooks.useDividers();
  const mapRef = React.useRef(map);
  const actionsRef = React.useRef(actions);

  mapRef.current = map;
  actionsRef.current = actions;

  React.useEffect(() => {
    const onStartSplit = (args: SplitArgs) => {
      const { containerId, from } = args;

      let direction: Direction | undefined;

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
              divider,
            } = onceSplit(container, to, direction);

            dividersActions.add(divider);

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

            const dividerId = divider.id;

            actionsRef.current.batch(actions);

            removeMouseListener(onMouseMove, onMouseUp);
            emitter.emit('resize', {
              previous: divider.previous,
              next: divider.next,
              dividerId,
              from: {
                x: to.x,
                y: to.y,
                directionType: divider.directionType,
              },
            });
          }
          return;
        }
      };

      const onMouseUp = () => {
        removeMouseListener(onMouseMove, onMouseUp);
      };

      addMouseListener(onMouseMove, onMouseUp);
    };

    emitter.on('split', onStartSplit);

    return () => {
      emitter.off('split', onStartSplit);
    };
  }, [emitter]);

  React.useEffect(() => {
    const onStartResize = (args: ResizeArgs) => {
      const { from, dividerId, previous, next } = args;

      const onMouseMove = (event: MouseEvent) => {
        const divider = dividersRef.current[dividerId];
        const { current: map } = mapRef;
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        const direction = resizeDirection(from, to, from.directionType);

        const delta = {
          x: Percentage.create(window.innerWidth, to.x - from.x),
          y: Percentage.create(window.innerHeight, to.y - from.y),
        };

        const isDeltaZero = Direction.isHorizontal(direction)
          ? delta.x === 0
          : delta.y === 0;

        if (isDeltaZero) {
          return;
        }

        const previousContainersData = previous.map((id: Id) => {
          const container = map[id];
          return actionCreators.update(
            Container.addId(
              container.id,
              Container.getSizeAndPositionFromDelta(
                container,
                delta,
                true,
                direction,
              ),
            ),
          );
        });

        const nextContainersAction = next.map((id) => {
          const container = map[id];
          return actionCreators.update(
            Container.addId(
              container.id,
              Container.getSizeAndPositionFromDelta(
                container,
                delta,
                false,
                direction,
              ),
            ),
          );
        });

        const { top, left } = Container.getSizeAndPositionFromDelta(
          map[next[0]],
          delta,
          false,
          direction,
        );

        if (top) {
          divider.top = top;
        }

        if (left) {
          divider.left = left;
        }

        const dividerUpdate = {
          ...divider,
        };

        dividersActions.update(dividerUpdate);

        actionsRef.current.batch(
          previousContainersData.concat(nextContainersAction),
        );

        from.x = to.x;
        from.y = to.y;
      };

      const onMouseUp = () => {
        removeMouseListener(onMouseMove, onMouseUp);
      };

      addMouseListener(onMouseMove, onMouseUp);
    };
    emitter.on('resize', onStartResize);

    return () => {
      emitter.off('resize', onStartResize);
    };
  }, [emitter]);

  return (
    <>
      {Object.keys(map).map((key) => {
        const item = map[key];
        const { id } = item;

        return (
          <Con key={id} emitter={emitter} component={component} {...item} />
        );
      })}
      {Object.keys(dividersRef.current).map((id) => {
        const divider = dividersRef.current[id];
        return <Divider {...divider} emitter={emitter} key={divider.id} />;
      })}
    </>
  );
};

export default Subdivide;
