import React from 'react';
import once from 'once';
import Direction from '../utils/Direction';
import Container from '../utils/Container';
import Id from '../utils/Id';
import Config from '../contexts/Config';
import { dragDirection, addMouseListener, removeMouseListener } from '../utils';
import { UseLayout } from './useLayout';
import {
  Emitter,
  SplitArgs,
  DividersMap,
  ContainersMap,
  DividerDataUpdate,
} from '../types';

const updateParentDividers = (
  childContainerId: Id,
  parentContainerId: Id,
  containers: ContainersMap,
  dividers: DividersMap,
): DividerDataUpdate[] => {
  const parentContainer = containers[parentContainerId];

  if (!parentContainer.parentDivider) {
    return [];
  }

  const parentDivider = dividers[parentContainer.parentDivider];

  const otherParentDividers = parentContainer.parentContainer
    ? updateParentDividers(
        childContainerId,
        parentContainer.parentContainer,
        containers,
        dividers,
      )
    : [];

  if (parentDivider.next.includes(parentContainerId)) {
    return otherParentDividers.concat([
      {
        id: parentDivider.id,
        next: parentDivider.next.concat(childContainerId),
      },
    ]);
  }

  return otherParentDividers.concat([
    {
      id: parentDivider.id,
      previous: parentDivider.previous.concat(childContainerId),
    },
  ]);
};

const useSplit = (layout: UseLayout, emitter: Emitter) => {
  const { splitRatio } = Config.useConfig();
  const [layoutRef, actions, actionCreators] = layout;
  React.useEffect(() => {
    const onStartSplit = (args: SplitArgs) => {
      const { containerId, from } = args;

      let direction: Direction | undefined;

      const onceSplit = once(Container.split);
      const onMouseMove = (event: MouseEvent) => {
        const {
          current: { containers, dividers },
        } = layoutRef;
        const container = containers[containerId];
        const to = {
          x: event.clientX,
          y: event.clientY,
        };

        if (!direction) {
          direction = dragDirection(from, to, splitRatio);
          if (direction) {
            const { originContainer, newContainer, divider } = onceSplit(
              container,
              to,
              direction,
            );

            const containersActions = [
              actionCreators.containers.update(originContainer),
              actionCreators.containers.add(newContainer),
            ];

            const dividersToUpdate = updateParentDividers(
              newContainer.id,
              container.id,
              containers,
              dividers as DividersMap,
            );

            actions.batch(
              dividersToUpdate
                .map((data) => actionCreators.dividers.update(data))
                .concat(actionCreators.dividers.add(divider))
                .concat(containersActions),
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
          }
          return;
        }
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
