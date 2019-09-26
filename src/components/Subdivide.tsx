import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Con from './Container';
import Direction from '../utils/Direction';
import { dragDirection, once } from '../utils';
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

  const [map, actions] = Hooks.useContainers();
  const listRef = React.useRef(map);
  const actionsRef = React.useRef(actions);

  listRef.current = map;
  actionsRef.current = actions;

  const split = (
    container: ContainerData,
    to: Vector,
    direction?: Direction,
  ): Id => {
    const isVertical = Direction.isVertical(direction);
    const { top, left } = container;
    const splitRatioPercentage = {
      vertical: Percentage.create(window.innerHeight, to.y - top),
      horizontal: Percentage.create(window.innerWidth, to.x - left),
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

    actionsRef.current.update(updateData);
    const id = actionsRef.current.add(newData);

    return id;
  };

  React.useEffect(() => {
    const onStartSplit = (args: SplitArgs) => {
      const { containerId, from } = args;

      let direction: Direction | undefined;
      let newContainerId: number | undefined;

      const onceSplit = once<Id>(split);
      const onMouseMove = (event: MouseEvent) => {
        const container = listRef.current[containerId];
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        if (!direction) {
          direction = dragDirection(from, to, splitRatio);
          if (direction && !newContainerId) {
            newContainerId = onceSplit(container, to, direction);
            from.x = to.x;
            from.y = to.y;
          }
          return;
        }

        if (!newContainerId) {
          return;
        }

        const newContainer = listRef.current[newContainerId];
        const delta = {
          x: Percentage.create(window.innerWidth, to.x - from.x),
          y: Percentage.create(window.innerHeight, to.y - from.y),
        };

        const containersUpdate = [
          addId(
            containerId,
            Container.getSizeAndPositionFromDelta(container, delta, direction),
          ),
          addId(
            newContainerId,
            Container.getSizeAndPositionFromDelta(
              newContainer,
              delta,
              Direction.getOpposite(direction),
            ),
          ),
        ];

        actionsRef.current.update(containersUpdate);

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
