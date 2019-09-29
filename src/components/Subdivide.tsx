import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import once from 'once';
import Con from './Container';
import Divider from './Divider';
import Direction from '../utils/Direction';
import { dragDirection, resizeDirection } from '../utils';
import useLayout from '../hooks/useLayout';
import Config from '../contexts/Config';
import Percentage from '../utils/Percentage';
import Id from '../utils/Id';
import Container from '../utils/Container';
import {
  Emitter,
  SplitArgs,
  ResizeArgs,
  ContainersMap,
  DividersMap,
  DividerDataUpdate,
  DividerData,
} from '../types';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

type EventHandler = (event: MouseEvent) => void;

const addMouseListener = (
  onMouseMove: EventHandler,
  onMouseUp: EventHandler,
) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};

const removeMouseListener = (
  onMouseMove: EventHandler,
  onMouseUp: EventHandler,
) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

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

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const { splitRatio } = Config.useConfig();
  const emitter = React.useMemo(() => new TinyEmitter() as Emitter, []);

  const [layoutRef, actions, actionCreators] = useLayout();

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

  React.useEffect(() => {
    const onStartResize = (args: ResizeArgs) => {
      const { from, dividerId, previous, next } = args;

      const onMouseMove = (event: MouseEvent) => {
        const {
          current: { dividers, containers },
        } = layoutRef;
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

  const {
    current: { dividers, containers },
  } = layoutRef;

  return (
    <>
      {Object.keys(containers).map((key) => {
        const item = containers[key];
        const { id } = item;

        return (
          <Con key={id} emitter={emitter} component={component} {...item} />
        );
      })}
      {Object.keys(dividers).map((id) => {
        const divider = dividers[id];
        return <Divider {...divider} emitter={emitter} key={divider.id} />;
      })}
    </>
  );
};

export default Subdivide;
