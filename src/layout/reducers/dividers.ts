import { DividersMap } from '../../types';
import { State } from '../types';
import { DirectionType } from '../../utils/Direction';
import Container from '../../utils/Container';

const dividersReducer = (state: State) => {
  const { rootId, containers } = state;
  const root = containers[rootId];

  if (!root.isGroup) {
    return {
      ...state,
      dividers: {},
    };
  }

  const getDividers = (group: Container): DividersMap => {
    const { children, directionType } = group;
    const isHorizontal = directionType === DirectionType.HORIZONTAL;

    return children.reduce<DividersMap>(
      (map, containerId: number, index: number) => {
        const container = containers[containerId];

        if (index === 0) {
          return container.isGroup ? getDividers(container) : map;
        }
        const previousId = children[index - 1];
        const previous = containers[previousId];

        const id = `${previous.id}-${container.id}`;
        const { left, top } = container;
        const width = isHorizontal ? 0 : container.width;
        const height = isHorizontal ? container.height : 0;

        if (!directionType) {
          return map;
        }

        const dividers = getDividers(container);

        return {
          ...map,
          [id]: {
            id,
            left,
            top,
            directionType,
            previous: previous.id,
            next: container.id,
            width,
            height,
          },
          ...dividers,
        };
      },
      {},
    );
  };

  return {
    ...state,
    dividers: getDividers(root),
  };
};

export default dividersReducer;
