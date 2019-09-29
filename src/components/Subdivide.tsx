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
  const [dividers, setDividers] = React.useState<DividerData[]>([]);
  const mapRef = React.useRef(map);
  const actionsRef = React.useRef(actions);
  const dividersRef = React.useRef(dividers);

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

            setDividers((dividers) => dividers.concat(divider));

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

            const dividerIndex = dividersRef.current.length;

            actionsRef.current.batch(actions);

            removeMouseListener(onMouseMove, onMouseUp);
            emitter.emit('resize', {
              previous: divider.previous[0],
              next: divider.next[0],
              dividerIndex,
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
      const { from, dividerIndex } = args;

      const onMouseMove = (event: MouseEvent) => {
        const previous = mapRef.current[args.previous];
        const next = mapRef.current[args.next];
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

        const previousContainerData = actionCreators.update(
          Container.addId(
            previous.id,
            Container.getSizeAndPositionFromDelta(
              previous,
              delta,
              true,
              direction,
            ),
          ),
        );

        const nextContainerData = Container.getSizeAndPositionFromDelta(
          next,
          delta,
          false,
          direction,
        );

        const nextContainerAction = actionCreators.update(
          Container.addId(next.id, nextContainerData),
        );

        // TODO: use reducer to storage the dividers
        setDividers((dividers) => {
          const divider = {
            ...dividers[dividerIndex],
          };
          if (nextContainerData.top) {
            divider.top = nextContainerData.top;
          }

          if (nextContainerData.left) {
            divider.left = nextContainerData.left;
          }

          return [
            ...dividers.slice(0, dividerIndex),
            divider,
            ...dividers.slice(dividerIndex + 1),
          ];
        });

        actionsRef.current.batch([previousContainerData, nextContainerAction]);

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
      {dividers.map((divider, index) => (
        <Divider {...divider} emitter={emitter} index={index} key={index} />
      ))}
    </>
  );
};

export default Subdivide;
