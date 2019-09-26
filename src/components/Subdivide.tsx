import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import once from 'once';
import Con from './Container';
import Direction from '../utils/Direction';
import { dragDirection } from '../utils';
import Hooks from '../hooks';
import Config from '../contexts/Config';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';
import Container from '../utils/Container';
import { ContainerData, Emitter, SplitArgs, NewContainerData } from '../types';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

interface Vector {
  x: number;
  y: number;
}

const addId = <T extends object>(id: Id, data: T): T & { id: Id } => {
  (data as T & { id: Id }).id = id;
  return data as T & { id: Id };
};

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const { splitRatio } = Config.useConfig();
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);

  const [map, actions, actionCreators] = Hooks.useContainers();
  const mapRef = React.useRef(map);
  const actionsRef = React.useRef(actions);

  mapRef.current = map;
  actionsRef.current = actions;

  const split = (
    container: ContainerData,
    to: Vector,
    direction: Direction,
  ): Id => {
    const isVertical = Direction.isVertical(direction);
    const { top, left, width, height } = Container.toPixels(container);
    const deltaX =
      direction === Direction.RIGHT ? to.x - left : left + width - to.x;
    const deltaY =
      direction === Direction.BOTTOM ? to.y - top : top + height - to.y;
    const splitRatioPercentage = {
      horizontal: Percentage.create(window.innerWidth, deltaX),
      vertical: Percentage.create(window.innerHeight, deltaY),
    };

    const updateData: ContainerData = {
      ...container,
      ...Container.getSizeAfterSplit(
        container,
        splitRatioPercentage,
        isVertical,
      ),
      ...Container.getPositionAfterSplit(
        container,
        splitRatioPercentage,
        direction,
      ),
    };

    const newData: NewContainerData = {
      ...Container.getSizeAfterSplitFrom(
        updateData,
        splitRatioPercentage,
        isVertical,
      ),
      ...Container.getPositionAfterSplitFrom(container, updateData, direction),
    };

    const id = Id.create();

    actionsRef.current.batch([
      actionCreators.update(updateData),
      actionCreators.add(addId(id, newData)),
    ]);

    return id;
  };

  React.useEffect(() => {
    const onStartSplit = (args: SplitArgs) => {
      const { containerId, from } = args;

      let direction: Direction | undefined;
      let newContainerId: number | undefined;

      const onceSplit = once(split);
      const onMouseMove = (event: MouseEvent) => {
        const container = mapRef.current[containerId];
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        if (!direction) {
          direction = dragDirection(from, to, splitRatio);
          if (direction) {
            newContainerId = onceSplit(container, to, direction);
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
          addId(
            containerId,
            Container.getSizeAndPositionFromDelta(container, delta, direction),
          ),
        );

        const newContainerData = actionCreators.update(
          addId(
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
