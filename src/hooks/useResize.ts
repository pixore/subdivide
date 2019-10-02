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
import { Action, ReadOnlyState } from '../hooks/useLayout/types';
import { DividerDataUpdate, ResizeArgs, Emitter, Vector } from '../types';

const isContainer = (state: ReadOnlyState, id: Id) =>
  Boolean(state.containers[id]);
const isGroup = (state: ReadOnlyState, id: Id) => Boolean(state.groups[id]);

const useResize = (layout: UseLayout, emitter: Emitter) => {
  const [layoutRef, actions, actionCreators] = layout;
  React.useEffect(() => {
    const getDividerUpdate = (
      id: Id,
      top: number | undefined,
      left: number | undefined,
    ) => {
      const dividerUpdate: DividerDataUpdate = {
        id,
      };

      if (top) {
        dividerUpdate.top = top;
      }

      if (left) {
        dividerUpdate.left = left;
      }

      return dividerUpdate;
    };

    const resizeItem = (
      itemId: Id,
      delta: Vector,
      direction: Direction,
      isPrevious: boolean,
    ): Action[] => {
      const actionsToDispatch: Action[] = [];
      const { containers, groups } = layoutRef.current;

      if (isContainer(layoutRef.current, itemId)) {
        const container = containers[itemId];
        const containerData = Container.getSizeAndPositionFromDelta(
          container,
          delta,
          isPrevious,
          direction,
        );
        const nextContainerData = actionCreators.containers.update(
          containerData,
        );

        actionsToDispatch.push(nextContainerData);
      } else if (isGroup(layoutRef.current, itemId)) {
        const group = groups[itemId];
        const groupData = Container.getSizeAndPositionFromDelta(
          group,
          delta,
          isPrevious,
          direction,
        );

        const groupUpdate = actionCreators.groups.update(groupData);

        // something

        actionsToDispatch.push(groupUpdate);
      }

      return actionsToDispatch;
    };

    const resize = (
      previous: Id,
      divider: Id,
      next: Id,
      direction: Direction,
      delta: Vector,
    ): Action[] => {
      const { containers, groups } = layoutRef.current;
      const { top, left } = Container.getSizeAndPositionFromDelta(
        isContainer(layoutRef.current, next) ? containers[next] : groups[next],
        delta,
        false,
        direction,
      );

      return [
        actionCreators.dividers.update(getDividerUpdate(divider, top, left)),
        ...resizeItem(previous, delta, direction, true),
        ...resizeItem(next, delta, direction, false),
      ];
    };

    const onStartResize = (args: ResizeArgs) => {
      const { from, dividerId, previous, next } = args;

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
          dividerId,
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
