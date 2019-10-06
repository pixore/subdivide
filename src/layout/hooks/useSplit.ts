import React from 'react';
import Direction, { DirectionType } from '../../utils/Direction';
import Id from '../../utils/Id';
import Container from '../../utils/Container';
import Config from '../../contexts/Config';
import { UseLayout } from './useLayout';
import {
  Emitter,
  SplitArgs,
  FromCorner,
  Vector,
  ContainersMap,
} from '../../types';
import { Action } from '../types';
import {
  dragDirection,
  addMouseListener,
  removeMouseListener,
} from '../../utils';

const useSplit = (layout: UseLayout, emitter: Emitter) => {
  const { splitRatio } = Config.useConfig();
  const [layoutRef, actions, actionCreators] = layout;
  React.useEffect(() => {
    const mergeAndRemoveParent = (container: Container, parent: Container) => {
      const { containers } = layoutRef.current;
      const actionsToDispatch: Action[] = [];
      if (parent.parent !== -1) {
        const grandParent = containers[parent.parent];
        const { children } = grandParent;
        const index = children.indexOf(parent.id);
        const updateGrandParent = {
          id: grandParent.id,
          children: [
            ...children.slice(0, index),
            container.id,
            ...children.slice(index + 1),
          ],
        };
        actionsToDispatch.push(actionCreators.update(updateGrandParent));
      } else {
        actionsToDispatch.push(actionCreators.updateRoot(container.id));
      }

      const { children } = parent;

      const updateContainer = {
        id: container.id,
        parent: parent.parent,
        splitRatio: parent.splitRatio,
        width: parent.width,
        height: parent.height,
        top: parent.top,
        left: parent.left,
      };

      return actionsToDispatch.concat([
        actionCreators.remove(
          children[0] === container.id ? children[1] : children[0],
        ),
        actionCreators.remove(parent.id),
        actionCreators.update(updateContainer),
      ]);
    };

    const mergeAndFill = (container: Container, direction: Direction) => {
      const { containers } = layoutRef.current;
      const isForward = Direction.isForward(direction);
      const parent = containers[container.parent];
      const { children } = parent;
      const index = children.indexOf(container.id);
      const siblingIndex = isForward ? index + 1 : index - 1;
      const siblingId = children[siblingIndex];
      const siblingContainer = containers[siblingId];
      const isVertical = parent.directionType === DirectionType.VERTICAL;

      const updateContainer = {
        id: container.id,
        splitRatio: container.splitRatio + siblingContainer.splitRatio,
        width: isVertical
          ? container.width
          : container.width + siblingContainer.width,
        height: isVertical
          ? container.height + siblingContainer.height
          : container.height,
        top: isForward ? container.top : siblingContainer.top,
        left: isForward ? container.left : siblingContainer.left,
      };

      const updateParent = {
        id: parent.id,
        children: children.filter((childId) => childId !== siblingContainer.id),
      };

      return [
        actionCreators.update(updateContainer),
        actionCreators.update(updateParent),
        actionCreators.remove(siblingContainer.id),
      ];
    };

    const merge = (containerId: Id, direction: Direction) => {
      const { containers } = layoutRef.current;
      const container = containers[containerId];
      const parent = containers[container.parent];

      actions.batch(
        parent.children.length === 2
          ? mergeAndRemoveParent(container, parent)
          : mergeAndFill(container, direction),
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

        if (direction === from.horizontal || direction === from.vertical) {
          merge(containerId, direction);
        } else {
          const delta = Container.getDelta(container, from, to);
          const { previous, next } = split(containerId, delta, direction);

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
        removeMouseListener(onMouseMove, onMouseUp);
      };

      const onMouseUp = () => {
        removeMouseListener(onMouseMove, onMouseUp);
      };

      addMouseListener(onMouseMove, onMouseUp);
    };

    emitter.on('cornerDrag', onStartSplit);

    return () => {
      emitter.off('cornerDrag', onStartSplit);
    };
  }, [emitter]);
};

export default useSplit;
