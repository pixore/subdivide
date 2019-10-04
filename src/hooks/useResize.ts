import React from 'react';
import Direction from '../utils/Direction';
import Container from '../utils/Container';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';
import { UseLayout } from './useLayout';
import {
  addMouseListener,
  removeMouseListener,
  resizeDirection,
} from '../utils';
import { Action } from '../hooks/useLayout/types';
import { ResizeArgs, Emitter, Vector } from '../types';

const useResize = (layout: UseLayout, emitter: Emitter) => {
  const [layoutRef, actions, actionCreators] = layout;
  React.useEffect(() => {
    const resizeItem = (
      itemId: Id,
      delta: Vector,
      direction: Direction,
      isPrevious: boolean,
    ): Action[] => {
      const actionsToDispatch: Action[] = [];
      const { containers } = layoutRef.current;

        const container = containers[itemId];
        const containerData = Container.getSizeAndPositionFromDelta(
          container,
          delta,
          isPrevious,
          direction,
        );
        const nextContainerData = actionCreators.update(
          containerData,
        );

        actionsToDispatch.push(nextContainerData);

        return actionsToDispatch
    };

    const resize = (
      previous: Id,
      next: Id,
      direction: Direction,
      delta: Vector,
    ): Action[] => {

      return [
        ...resizeItem(previous, delta, direction, true),
        ...resizeItem(next, delta, direction, false),
      ];
    };

    const onStartResize = (args: ResizeArgs) => {
      const { from, previous, next } = args;

      const onMouseMove = (event: MouseEvent) => {
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

        const actionsToDispatch = resize(
          previous,
          next,
          direction,
          delta,
        );

        actions.batch(actionsToDispatch);

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
};

export default useResize;
