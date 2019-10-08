import React from 'react';
import Id from '../../utils/Id';
import Container from '../../utils/Container';
import reducer from '../reducers/main';
import { actionCreators, createActions } from '../actions';
import { ContainersMap, Emitter } from '../../types';
import { State, Actions, ActionsCreator } from '../types';
import useResize from './useResize';
import useSplit from './useSplit';
import Direction from '../../utils/Direction';
import { throttle } from '../../utils';

const rootId = Id.create();

const createInitialContainer = (id: Id): ContainersMap => {
  const item: Container = {
    id,
    parent: -1,
    isGroup: false,
    children: [],
    splitRatio: 100,
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  };

  return {
    [item.id]: item,
  };
};

const defaultState: State = {
  rootId,
  containers: createInitialContainer(rootId),
  dividers: {},
  overlay: {
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    direction: Direction.RIGHT,
    show: false,
  },
  layout: {
    width: 100,
    height: 100,
    top: 0,
    left: 0,
  }
};

export type UseLayout = [
  React.MutableRefObject<State>,
  Actions,
  ActionsCreator,
];

export interface Options {
  onLayoutChange?: (layout: State) => void;
  initialState?: State;
}

const useLayout = (emitter: Emitter, options: Options = {}): UseLayout => {
  const { onLayoutChange, initialState } = options;
  const [state, dispatch] = React.useReducer(
    reducer,
    initialState || defaultState,
  );
  const actions = React.useMemo(() => createActions(dispatch), [dispatch]);
  const layoutChange = React.useMemo(
    () => onLayoutChange && throttle(onLayoutChange),
    [onLayoutChange],
  );
  const stateRef: React.MutableRefObject<State> = React.useRef<State>(state);
  stateRef.current = state;

  const layout: UseLayout = [stateRef, actions, actionCreators];

  React.useEffect(() => {
    if (layoutChange) {
      layoutChange(state);
    }
  }, [state, layoutChange]);

  useSplit(layout, emitter);
  useResize(layout, emitter);

  return layout;
};

export default useLayout;
