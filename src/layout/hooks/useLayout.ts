import React from 'react';
import Id from '../../utils/Id';
import Container from '../../utils/Container';
import reducer from '../reducers/main';
import { actionCreators, createActions } from '../actions';
import { Emitter, LayoutUpdate } from '../../types';
import { State, Actions, ActionsCreator } from '../types';
import useResize from './useResize';
import useSplit from './useSplit';
import Direction from '../../utils/Direction';
import { throttle } from '../../utils';

const createDefaultState = (): State => {
  const id = Id.create();
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
    rootId: item.id,
    containers: {
      [item.id]: item,
    },
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
      top: 0,
      left: 0,
      width: 100,
      height: 100,
    },
  };
};

const defaultState = createDefaultState();

export type UseLayout = [
  React.MutableRefObject<State>,
  Actions,
  ActionsCreator,
];

export interface Options {
  onLayoutChange?: (layout: State) => void;
  initialState?: State;
  size?: {
    width?: number;
    height?: number;
  };
  position?: {
    top?: number;
    left?: number;
  };
}

const defaultOptions = {
  size: {},
};

const mergeOptionsWithInitialState = (
  state: State,
  options: Options,
): State => {
  const { size = {}, position = {} } = options;
  const { height, width } = size;
  const { top, left } = position;

  const layoutUpdate: LayoutUpdate = {};

  if (height) {
    layoutUpdate.height = height;
  }

  if (width) {
    layoutUpdate.width = width;
  }

  if (left) {
    layoutUpdate.left = left;
  }

  if (top) {
    layoutUpdate.top = top;
  }

  return {
    ...state,
    layout: {
      ...state.layout,
      ...layoutUpdate,
    },
  };
};

const getInitialState = (
  initialState: State | undefined,
  options: Options,
): State => {
  return mergeOptionsWithInitialState(initialState || defaultState, options);
};

const useLayout = (
  emitter: Emitter,
  options: Options = defaultOptions,
): UseLayout => {
  const { onLayoutChange, initialState } = options;

  const [state, dispatch] = React.useReducer(
    reducer,
    getInitialState(initialState, options),
  );
  const { size = {}, position = {} } = options;
  const { height, width } = size;
  const { top, left } = position;
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

  React.useEffect(() => {
    const layoutUpdate: LayoutUpdate = {};
    if (!top) {
      layoutUpdate.top = top;
    }

    if (!width) {
      layoutUpdate.left = left;
    }
    actions.updateLayout(layoutUpdate);
  }, [top, left]);

  React.useEffect(() => {
    if (height && width) {
      return;
    }

    const getLayoutUpdate = () => {
      const { innerHeight, innerWidth } = window;
      const layoutUpdate: LayoutUpdate = {};

      if (!height) {
        layoutUpdate.height = innerHeight;
      }

      if (!width) {
        layoutUpdate.width = innerWidth;
      }

      return layoutUpdate;
    };

    const onResize = () => {
      actions.updateLayout(getLayoutUpdate());
    };

    console.log(getLayoutUpdate());

    actions.updateLayout(getLayoutUpdate());
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [height, width]);

  useSplit(layout, emitter);
  useResize(layout, emitter);

  return layout;
};
export { createDefaultState };
export default useLayout;
