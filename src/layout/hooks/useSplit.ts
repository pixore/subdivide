import * as React from 'react';
import Direction, { DirectionType } from '../../utils/Direction';
import Id from '../../utils/Id';
import Vector from '../../utils/Vector';
import Container from '../../utils/Container';
import Config from '../../contexts/Config';
import { UseLayout } from './useLayout';
import { Emitter, SplitArgs, Corner, ContainersMap } from '../../types';
import { Action } from '../types';
import {
  dragDirection,
  addMouseListener,
  removeMouseListener,
  numberIsBetween,
} from '../../utils';
import Percentage from '../../utils/Percentage';

const getAdjacentContainerFactory = (direction: number) => (
  containers: ContainersMap,
  id: Id,
) => {
  const container = containers[id];
  const { children } = containers[container.parent];
  const index = children.indexOf(id);
  const nextId = children[index + direction];
  return containers[nextId];
};

const getNextContainer = getAdjacentContainerFactory(1);
const getPrevContainer = getAdjacentContainerFactory(-1);

const actionsFactory = (layout: UseLayout) => {
  const [layoutRef, actions, actionCreators] = layout;

  const getTo = (event: MouseEvent): Vector => {
    const { layout } = layoutRef.current;

    return {
      x: Percentage.create(layout.width, event.clientX - layout.left),
      y: Percentage.create(layout.height, event.clientY - layout.top),
    };
  };

  const mergeAndRemoveParent = (from: Container, to: Container) => {
    const { containers } = layoutRef.current;
    const parent = containers[from.parent];
    const actionsToDispatch: Action[] = [];

    if (parent.parent !== -1) {
      const grandParent = containers[parent.parent];
      const { children } = grandParent;
      const index = children.indexOf(parent.id);
      const updateGrandParent = {
        id: grandParent.id,
        children: [
          ...children.slice(0, index),
          from.id,
          ...children.slice(index + 1),
        ],
      };
      actionsToDispatch.push(actionCreators.update(updateGrandParent));
    } else {
      actionsToDispatch.push(actionCreators.updateRoot(from.id));
    }

    const updateContainer = {
      id: from.id,
      parent: parent.parent,
      splitRatio: parent.splitRatio,
      width: parent.width,
      height: parent.height,
      top: parent.top,
      left: parent.left,
    };

    return actionsToDispatch.concat([
      actionCreators.remove(to.id),
      actionCreators.remove(parent.id),
      actionCreators.update(updateContainer),
    ]);
  };

  const mergeAndFill = (from: Container, to: Container) => {
    const { containers } = layoutRef.current;
    const parent = containers[from.parent];
    const { children } = parent;
    const fromIndex = children.indexOf(from.id);
    const toIndex = children.indexOf(to.id);
    const isForward = fromIndex < toIndex;
    const isVertical = parent.directionType === DirectionType.VERTICAL;

    const updateContainer = {
      id: from.id,
      splitRatio: from.splitRatio + to.splitRatio,
      width: isVertical ? from.width : from.width + to.width,
      height: isVertical ? from.height + to.height : from.height,
      top: isForward ? from.top : to.top,
      left: isForward ? from.left : to.left,
    };

    const updateParent = {
      id: parent.id,
      children: children.filter((childId) => childId !== to.id),
    };

    return [
      actionCreators.update(updateContainer),
      actionCreators.update(updateParent),
      actionCreators.remove(to.id),
    ];
  };

  const merge = (from: Container, to: Container) => {
    const { containers } = layoutRef.current;
    const parent = containers[from.parent];

    actions.batch(
      parent.children.length === 2
        ? mergeAndRemoveParent(from, to)
        : mergeAndFill(from, to),
    );
  };

  const split = (containerId: Id, delta: Vector, direction: Direction) => {
    const { containers } = layoutRef.current;
    const container = containers[containerId];

    const { previous, next, rootId, parent } = Container.split(
      container.id,
      layoutRef.current,
      direction,
      delta,
    );

    const actionsToDispatch: Action[] = [];
    if (previous.id === container.id) {
      actionsToDispatch.push(
        actionCreators.update(next),
        actionCreators.add(previous),
      );
    } else {
      actionsToDispatch.push(
        actionCreators.update(previous),
        actionCreators.add(next),
      );
    }

    if (parent.id === container.parent) {
      actionsToDispatch.push(actionCreators.update(parent));
    } else {
      if (container.parent !== -1) {
        const originParent = containers[container.parent];
        const index = originParent.children.indexOf(container.id);
        const children = [
          ...originParent.children.slice(0, index),
          parent.id,
          ...originParent.children.slice(index + 1),
        ];
        actionsToDispatch.push(
          actionCreators.update({
            ...originParent,
            children,
          }),
        );
      }
      actionsToDispatch.push(actionCreators.add(parent));
    }

    if (typeof rootId === 'number') {
      actionsToDispatch.push(actionCreators.updateRoot(rootId));
    }

    actions.batch(actionsToDispatch);
    return {
      previous,
      next,
    };
  };

  const getContainersToMerge = (
    container: Container,
    corner: Corner,
    directionType: DirectionType,
  ) => {
    const { containers } = layoutRef.current;
    const isNext =
      directionType === DirectionType.HORIZONTAL
        ? corner.horizontal === Direction.RIGHT
        : corner.vertical === Direction.BOTTOM;

    if (isNext) {
      return {
        prev: container,
        next: getNextContainer(containers, container.id),
      };
    }

    return {
      prev: getPrevContainer(containers, container.id),
      next: container,
    };
  };

  const getMergePosition = (
    directionType: DirectionType,
    to: Vector,
    next: Container,
    prev: Container,
  ) => {
    if (directionType === DirectionType.HORIZONTAL) {
      return {
        isNext: numberIsBetween(to.x, next.left + next.width, next.left),
        isPrev: numberIsBetween(to.x, prev.left + prev.width, prev.left),
      };
    }

    return {
      isNext: numberIsBetween(to.y, next.top + next.height, next.top),
      isPrev: numberIsBetween(to.y, prev.top + prev.height, prev.top),
    };
  };

  const getMergeDirection = (directionType: DirectionType, isPrev: boolean) => {
    if (directionType === DirectionType.HORIZONTAL) {
      return isPrev ? Direction.RIGHT : Direction.LEFT;
    }

    return isPrev ? Direction.TOP : Direction.BOTTOM;
  };

  const showOverlay = (container: Container, direction: Direction) => {
    actions.showOverlay({
      width: container.width,
      height: container.height,
      top: container.top,
      left: container.left,
      direction,
    });
  };

  const startMerge = (container: Container, corner: Corner) => {
    const { containers } = layoutRef.current;
    const parent = containers[container.parent];
    if (!parent || !parent.directionType) {
      console.warn('cannot be merged');
      return;
    }

    const { directionType } = parent;

    const { prev, next } = getContainersToMerge(
      container,
      corner,
      directionType,
    );

    if (prev.isGroup || next.isGroup) {
      console.warn('cannot be merged');
      return;
    }

    const onMouseMove = (event: MouseEvent) => {
      const to = getTo(event);

      const { isNext, isPrev } = getMergePosition(
        directionType,
        to,
        next,
        prev,
      );

      if (isNext) {
        showOverlay(next, getMergeDirection(directionType, false));
      }

      if (isPrev) {
        showOverlay(prev, getMergeDirection(directionType, true));
      }
    };

    const onMouseUp = (event: MouseEvent) => {
      const to = getTo(event);

      const { isNext, isPrev } = getMergePosition(
        directionType,
        to,
        next,
        prev,
      );

      if (isNext) {
        merge(prev, next);
      }

      if (isPrev) {
        merge(next, prev);
      }

      actions.hideOverlay();
      removeMouseListener(onMouseMove, onMouseUp);
    };

    addMouseListener(onMouseMove, onMouseUp);
  };

  return {
    split,
    startMerge,
  };
};

const useSplit = (layout: UseLayout, emitter: Emitter) => {
  const { splitRatio } = Config.useConfig();
  const [layoutRef] = layout;
  React.useEffect(() => {
    const { startMerge, split } = actionsFactory(layout);
    const onStartDrag = (args: SplitArgs) => {
      const { containerId, from } = args;

      let direction: Direction | undefined;
      const onMouseMove = (event: MouseEvent) => {
        const { containers, layout } = layoutRef.current;
        const container = containers[containerId];
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        const percentageTo = Vector.fromPercentage(
          Vector.subtract(to, Vector.fromPosition(layout)),
          layout.width,
          layout.height,
        );

        if (direction) {
          console.warn("This shouldn't happen");
          return;
        }

        direction = dragDirection(from, to, splitRatio);
        if (!direction) {
          // nothing to do here yet
          return;
        }

        const parent = containers[container.parent];
        const directionType = Direction.getType(direction);
        const oppositeDirection = Direction.getOpposite(direction);
        const isMerge =
          (direction === from.horizontal || direction === from.vertical) &&
          parent &&
          parent.directionType === directionType;

        const isSplit =
          !isMerge &&
          (oppositeDirection === from.horizontal ||
            oppositeDirection === from.vertical);

        if (isMerge) {
          removeMouseListener(onMouseMove, onMouseUp);
          startMerge(container, {
            vertical: from.vertical,
            horizontal: from.horizontal,
          });
        } else if (isSplit) {
          const delta = Container.getDelta(container, from, percentageTo);
          const { previous, next } = split(containerId, delta, direction);

          removeMouseListener(onMouseMove, onMouseUp);
          emitter.emit('resize', {
            previous: previous.id,
            next: next.id,
            from: {
              x: to.x,
              y: to.y,
              directionType: Direction.getType(direction),
            },
          });
        }
      };

      const onMouseUp = () => {
        removeMouseListener(onMouseMove, onMouseUp);
      };

      addMouseListener(onMouseMove, onMouseUp);
    };

    emitter.on('cornerDrag', onStartDrag);

    return () => {
      emitter.off('cornerDrag', onStartDrag);
    };
  }, [emitter]);
};

export default useSplit;
