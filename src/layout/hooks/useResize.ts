import React from 'react';
import Direction from '../../utils/Direction';
import Container from '../../utils/Container';
import Percentage from '../../utils/Percentage';
import Vector from '../../utils/Vector';
import { UseLayout } from './useLayout';
import {
  addMouseListener,
  removeMouseListener,
  resizeDirection,
  throttle,
} from '../../utils';
import { Action } from '../types';
import { ResizeArgs, Emitter } from '../../types';

const useResize = (layout: UseLayout, emitter: Emitter) => {
  const [layoutRef, actions, actionCreators] = layout;
  React.useEffect(() => {
    const resizeItem = (
      container: Container,
      delta: Vector,
      direction: Direction,
      isPrevious: boolean,
      splitDelta: Vector,
    ): Action[] => {
      const actionsToDispatch: Action[] = [];

      const containerData = {
        ...Container.getSizeAndPositionFromDelta(
          container,
          delta,
          isPrevious,
          direction,
        ),
        splitRatio: Container.getSplitRatio(
          container.splitRatio,
          splitDelta,
          direction,
          isPrevious,
        ),
      };
      const nextContainer = actionCreators.update(containerData);

      actionsToDispatch.push(nextContainer);

      return actionsToDispatch;
    };

    const resize = (
      parent: Container,
      previous: Container,
      next: Container,
      direction: Direction,
      delta: Vector,
    ): Action[] => {
      const splitDelta: Vector = {
        x: Percentage.ofPercentage(delta.x, parent.width),
        y: Percentage.ofPercentage(delta.y, parent.height),
      };
      return [
        ...resizeItem(previous, delta, direction, true, splitDelta),
        ...resizeItem(next, delta, direction, false, splitDelta),
      ];
    };

    const onStartResize = (args: ResizeArgs) => {
      const { from, previous, next } = args;

      const onMouseMove = throttle((event: MouseEvent) => {
        const { containers, layout } = layoutRef.current;
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        const direction = resizeDirection(from, to, from.directionType);

        const delta = {
          x: Percentage.create(layout.width, to.x - from.x),
          y: Percentage.create(layout.height, to.y - from.y),
        };

        const isDeltaZero = Direction.isHorizontal(direction)
          ? delta.x === 0
          : delta.y === 0;

        if (isDeltaZero) {
          return;
        }

        const previousContainer = containers[previous];
        const parent = containers[previousContainer.parent];

        const actionsToDispatch = resize(
          parent,
          containers[previous],
          containers[next],
          direction,
          delta,
        );

        actions.batch(actionsToDispatch);

        from.x = to.x;
        from.y = to.y;
      });

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
};

export default useResize;
