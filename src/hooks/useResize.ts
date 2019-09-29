import React from 'react';
import Direction from '../utils/Direction';
import Container from '../utils/Container';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';
import {
  addMouseListener,
  removeMouseListener,
  resizeDirection,
} from '../utils';
import { UseLayout } from './useLayout';
import { DividerData, ResizeArgs, Emitter } from '../types';

const useResize = (layout: UseLayout, emitter: Emitter) => {
  const [layoutRef, actions, actionCreators] = layout;
  React.useEffect(() => {
    const onStartResize = (args: ResizeArgs) => {
      const { from, dividerId, previous, next } = args;

      const onMouseMove = (event: MouseEvent) => {
        const { dividers, containers } = layoutRef.current;
        const divider = dividers[dividerId];
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
          const container = containers[id];
          return actionCreators.containers.update(
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
          const container = containers[id];
          return actionCreators.containers.update(
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
          containers[next[0]],
          delta,
          false,
          direction,
        );

        const dividerUpdate = {
          ...(divider as DividerData),
        };

        if (top) {
          dividerUpdate.top = top;
        }

        if (left) {
          dividerUpdate.left = left;
        }

        actions.batch(
          previousContainersData
            .concat(nextContainersAction)
            .concat(actionCreators.dividers.update(dividerUpdate)),
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
};

export default useResize;
