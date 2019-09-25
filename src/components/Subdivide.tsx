import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Con from './Container';
import Direction from '../utils/Direction';
import { dragDirection, once } from '../utils';
import Hooks from '../hooks';
import Config from '../contexts/Config';
import Percentage from '../utils/Percentage';
import Container from '../utils/Container';
import { ContainerData, Emitter, SplitArgs, NewContainerData } from '../types';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const { splitRatio } = Config.useConfig();
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);

  const [list, actions] = Hooks.useContainers();
  const listRef = React.useRef<ContainerData[]>(list);
  const actionsRef = React.useRef(actions);

  listRef.current = list;
  actionsRef.current = actions;

  const split = (
    containerIndex: number,
    container: ContainerData,
    direction?: Direction,
  ): number => {
    const isVertical = Direction.isVertical(direction);
    const splitRatioPercentage = {
      vertical: Percentage.create(window.innerHeight, splitRatio),
      horizontal: Percentage.create(window.innerWidth, splitRatio),
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

    console.log(updateData, newData);

    actionsRef.current.update(containerIndex, updateData);
    const index = actionsRef.current.push(newData);

    return index;
  };

  React.useEffect(() => {
    const onStartSplit = (args: SplitArgs) => {
      const { containerIndex, from } = args;
      let direction: Direction | undefined;
      let newContainerIndex: number | undefined;

      const onceSplit = once(split);
      const onMouseMove = (event: MouseEvent) => {
        const container = listRef.current[containerIndex];
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        if (!direction) {
          direction = dragDirection(from, to, splitRatio);
          if (direction) {
            from.x = to.x;
            from.y = to.y;
          }
          return;
        }

        if (!newContainerIndex) {
          newContainerIndex = onceSplit(containerIndex, container, direction);
          return;
        }

        const newContainer = listRef.current[newContainerIndex];
        const delta = {
          x: Percentage.create(window.innerWidth, to.x - from.x),
          y: Percentage.create(window.innerHeight, to.y - from.y),
        };

        console.log(
          container,
          listRef.current,
          Container.getSizeAndPositionFromDelta(container, delta, direction),
        );

        actionsRef.current.update(
          containerIndex,
          Container.getSizeAndPositionFromDelta(container, delta, direction),
        );

        actionsRef.current.update(
          newContainerIndex,
          Container.getSizeAndPositionFromDelta(
            newContainer,
            delta,
            Direction.getOpposite(direction),
          ),
        );

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
      {list.map((item, index) => {
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
