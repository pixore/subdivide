import React from 'react';
import Id from '../../utils/Id';
import Percentage from '../../utils/Percentage';
import reducer from '../reducers/main';
import { actionCreators, createActions } from '../actions';
import { ContainersMap, ContainerData, Emitter } from '../../types';
import { State, Actions, ActionsCreator, ReadOnlyState } from '../types';
import useResize from './useResize';
import useSplit from './useSplit';

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

const useLayout = (emitter: Emitter): UseLayout => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const actions = React.useMemo(() => createActions(dispatch), [dispatch]);
  const stateRef: React.MutableRefObject<State> = React.useRef<State>(state);

  stateRef.current = state;

  const layout: UseLayout = [stateRef, actions, actionCreators];

  useSplit(layout, emitter);
  useResize(layout, emitter);

  return layout;
};

export { initialState };
export default useLayout;
