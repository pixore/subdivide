import React from 'react';
import Direction from '../../utils/Direction';
import Container from '../../utils/Container';
import Config from '../../contexts/Config';
import {
  dragDirection,
  addMouseListener,
  removeMouseListener,
} from '../../utils';
import { UseLayout } from './useLayout';
import { Emitter, SplitArgs } from '../../types';
import { Action } from '../types';

const useSplit = (layout: UseLayout, emitter: Emitter) => {
  const { splitRatio } = Config.useConfig();
  const [layoutRef, actions, actionCreators] = layout;
  React.useEffect(() => {
    const onStartSplit = (args: SplitArgs) => {
      const { containerId, from } = args;

      let direction: Direction | undefined;
      const onMouseMove = (event: MouseEvent) => {
        const { containers } = layoutRef.current;
        const container = containers[containerId] as Container;
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        if (direction) {
          console.warn("This shouldn't happen");
          return;
        }

        direction = dragDirection(from, to, splitRatio);
        if (!direction) {
          // nothing to do here yet
          return;
        }

        const delta = Container.getDelta(container, from, to);

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
};

export default useSplit;