import { ContainerUpdate, ContainersMap } from '../../types';
import { State, ActionType, Action } from '../types';
import { DirectionType } from '../../utils/Direction';
import Container from '../../utils/Container';
import Id from '../../utils/Id';

const updateChildren = (
  parent: Container,
  containers: ContainersMap,
): ContainersMap => {
  if (!parent.isGroup) {
    return containers;
  }

  const isHorizontal = parent.directionType === DirectionType.HORIZONTAL;

  const { children } = parent;
  let { left, top } = parent;

  return children.reduce<ContainersMap>((currentContainers, id: Id) => {
    const container = currentContainers[id];
    const { splitRatio } = container;
    const decimalSplitRatio = splitRatio / 100;
    const width = isHorizontal
      ? decimalSplitRatio * parent.width
      : parent.width;
    const height = isHorizontal
      ? parent.height
      : decimalSplitRatio * parent.height;

    const containerUpdate = {
      ...container,
      width,
      height,
      left,
      top,
    };
    if (isHorizontal) {
      left = left + width;
    } else {
      top = top + height;
    }

    return {
      ...currentContainers,
      ...updateChildren(containerUpdate, currentContainers),
      [id]: containerUpdate,
    };
  }, containers);
};

const groupReducer = (state: State, action: Action): State => {
  if (Array.isArray(action)) {
    return action.reduce(groupReducer, state);
  }

  const { type, payload } = action;
  const { containers } = state;
  if (type !== ActionType.UPDATE_CONTAINER) {
    return state;
  }

  const containerUpdate = payload as ContainerUpdate;
  const id = containerUpdate.id;
  const container = containers[id];

  const checkChildrenIsNeeded =
    typeof containerUpdate.width === 'number' ||
    typeof containerUpdate.height === 'number' ||
    typeof containerUpdate.top === 'number' ||
    typeof containerUpdate.left === 'number';

  if (checkChildrenIsNeeded) {
    return {
      ...state,
      containers: updateChildren(container, state.containers),
    };
  }

  return state;
};

export default groupReducer;
