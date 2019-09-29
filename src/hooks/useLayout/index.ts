import React from 'react';
import Id from '../../utils/Id';
import Percentage from '../../utils/Percentage';
import reducer, { actionCreators, createActions } from './reducer';
import { ContainersMap } from '../../types';
import { State, Actions, ActionsCreator, ReadOnlyState } from './types';

const createInitialContainer = (): ContainersMap => {
  const { innerWidth: width, innerHeight: height } = window;
  const item = {
    id: Id.create(),
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
  containers: createInitialContainer(),
  dividers: {},
};

type UseLayout = [
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

export default useLayout;
