import { State, Action, Actions, ActionType, ActionsCreator } from './types';
import { ContainerData, ContainerDataUpdate, DividersMap } from '../../types';
import Id from '../../utils/Id';
import * as containers from './containersReducer';
import Direction from '../../utils/Direction';

const rootReducer = (state: Id, action: Action): Id => {
  const { type, payload } = action;
  if (type === ActionType.UPDATE_ROOT) {
    return payload as Id;
  }

  return state;
};

const generateDividers = (state: State) => {
  const { rootId, containers } = state;
  const root = containers[rootId];

  if (!root.isGroup) {
    return {
      ...state,
      dividers: {},
    };
  }

  const getDividers = (group: ContainerData): DividersMap => {
    const { children, directionType } = group;
    const isHorizontal = directionType === Direction.DirectionType.HORIZONTAL;

    return children.reduce<DividersMap>(
      (map, containerId: Id, index: number) => {
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

const actionReducer = (state: State, action: Action): State => {
  if (Array.isArray(action)) {
    return action.reduce(actionReducer, state);
  }

  return {
    rootId: rootReducer(state.rootId, action),
    containers: containers.reducer(state.containers, action),
    dividers: state.dividers,
  };
};

const reducer = (state: State, action: Action): State => {
  return generateDividers(actionReducer(state, action));
};

const actionCreators: ActionsCreator = {
  add: (data: ContainerData) => ({
    type: ActionType.ADD_CONTAINER,
    payload: data as ContainerData,
  }),
  update: (data: ContainerDataUpdate) => ({
    type: ActionType.UPDATE_CONTAINER,
    payload: data,
  }),
  remove: (id: Id) => ({
    type: ActionType.REMOVE_CONTAINER,
    payload: id,
  }),
  updateRoot: (id: Id) => ({
    type: ActionType.UPDATE_ROOT,
    payload: id,
  }),
};

type Dispatch = (action: Action | Action[]) => void;
const createActions = (dispatch: Dispatch): Actions => ({
  add(data: ContainerData) {
    dispatch(actionCreators.add(data));
  },
  update(data: ContainerDataUpdate) {
    dispatch(actionCreators.update(data));
  },
  remove(id: Id) {
    dispatch(actionCreators.remove(id));
  },
  updateRoot(id: Id) {
    dispatch(actionCreators.updateRoot(id));
  },
  batch(actions: Action[]) {
    dispatch(actions);
  },
});

export { actionCreators, createActions };

export default reducer;
