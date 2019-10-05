import React from 'react';
import Id from '../../utils/Id';
import Percentage from '../../utils/Percentage';
import reducer, { actionCreators, createActions } from './reducer';
import { ContainersMap, ContainerData } from '../../types';
import { State, Actions, ActionsCreator, ReadOnlyState } from './types';

const rootId = Id.create();

const createInitialContainer = (id: Id): ContainersMap => {
  const { innerWidth: width, innerHeight: height } = window;
  const item: ContainerData = {
    id,
    parent: -1,
    isGroup: false,
    children: [],
    splitRatio: 100,
    top: Percentage.create(height, 0),
    left: Percentage.create(width, 0),
    width: Percentage.create(width, width),
    height: Percentage.create(height, height),
  };

  return {
    [item.id]: item,
  };
};

const initialState: State = {
  rootId,
  containers: createInitialContainer(rootId),
  dividers: {},
};

export type UseLayout = [
  React.MutableRefObject<ReadOnlyState>,
  Actions,
  ActionsCreator,
];

const useLayout = (): UseLayout => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const actions = React.useMemo(() => createActions(dispatch), [dispatch]);
  const stateRef: React.MutableRefObject<State> = React.useRef<State>(state);

  stateRef.current = state;
  return [stateRef, actions, actionCreators];
};

export {
  initialState,
}
export default useLayout;
