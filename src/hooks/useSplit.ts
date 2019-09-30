import React from 'react';
import Direction from '../utils/Direction';
import Container from '../utils/Container';
import Config from '../contexts/Config';
import { dragDirection, addMouseListener, removeMouseListener } from '../utils';
import { UseLayout } from './useLayout';
import { Emitter, SplitArgs } from '../types';

const useSplit = (layout: UseLayout, emitter: Emitter) => {
  const { splitRatio } = Config.useConfig();
  const [layoutRef, actions, actionCreators] = layout;
  React.useEffect(() => {
    const onStartSplit = (args: SplitArgs) => {
      const { containerId, from } = args;

      let direction: Direction | undefined;
      const onMouseMove = (event: MouseEvent) => {
        const { containers } = layoutRef.current;
        const container = containers[containerId];
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

        const { originContainer, newContainer, divider } = Container.split(
          container.id,
          layoutRef.current,
          direction,
          to,
        );

        const containersActions = [
          actionCreators.containers.update(originContainer),
          actionCreators.containers.add(newContainer),
        ];

        actions.batch(
          containersActions.concat(actionCreators.dividers.add(divider)),
        );

        removeMouseListener(onMouseMove, onMouseUp);
        emitter.emit('resize', {
          previous: divider.previous,
          next: divider.next,
          dividerId: divider.id,
          from: {
            x: to.x,
            y: to.y,
            directionType: divider.directionType,
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
