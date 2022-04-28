import React from 'react';
import { RawState, State } from '../layout/types';
import Direction, { DirectionType } from '../utils/Direction';

interface ClassNames {
  layout: string;
  corner: string;
  container: string;
  divider: string;
  verticalDivider: string;
  horizontalDivider: string;
}

interface OptionalClassNames {
  layout?: string;
  corner?: string;
  container?: string;
  divider?: string;
  verticalDivider?: string;
  horizontalDivider?: string;
}

const defaultClassNames = {
  layout: 'px-layout',
  corner: 'px-corner',
  container: 'px-container',
  divider: 'px-divider',
  verticalDivider: 'px-divider--vertical',
  horizontalDivider: 'px-divider--horizontal',
};

const initialValue = {
  classNames: defaultClassNames,
  cornerSize: 40,
  splitRatio: 40,
};

export interface ConfigState {
  onLayoutChange?: (state: State) => void;
  initialState?: State;
  classNames: ClassNames;
  cornerSize: number;
  splitRatio: number;
}

interface Props {
  initialState?: State | RawState;
  onLayoutChange?: (state: State) => void;
  classNames?: OptionalClassNames;
  cornerSize?: number;
  splitRatio?: number;
  children: React.ReactNode;
}

const ConfigContext = React.createContext<ConfigState>(initialValue);

function checkState(state: any): asserts state is State {
  if (process.env.NODE_ENV !== 'production') {
    const containers = Object.keys(state?.containers ?? {}).every((key) => {
      const container = state?.containers[key];

      return (
        container.directionType === undefined ||
        container.directionType === DirectionType.HORIZONTAL ||
        container.directionType === DirectionType.VERTICAL
      );
    });
    const dividers = Object.keys(state?.dividers ?? {}).every((key) => {
      const divider = state?.dividers[key];

      return (
        divider.directionType === DirectionType.HORIZONTAL ||
        divider.directionType === DirectionType.VERTICAL
      );
    });

    const overlay =
      state?.overlay?.direction === Direction.TOP ||
      state?.overlay?.direction === Direction.BOTTOM ||
      state?.overlay?.direction === Direction.LEFT ||
      state?.overlay?.direction === Direction.RIGHT;

    if (!containers) {
      throw new Error('Invalid subdivide state: Invalid container found');
    }

    if (!dividers) {
      throw new Error('Invalid subdivide state: Invalid divider found');
    }

    if (!overlay) {
      throw new Error('Invalid subdivide state: Invalid overlay found');
    }
  }
}

function Provider(props: Props) {
  const {
    children,
    initialState,
    onLayoutChange,
    classNames = {},
    cornerSize = initialValue.cornerSize,
    splitRatio = initialValue.splitRatio,
  } = props;

  checkState(initialState);

  const {
    layout = defaultClassNames.layout,
    corner = defaultClassNames.corner,
    container = defaultClassNames.container,
    divider = defaultClassNames.divider,
    verticalDivider = defaultClassNames.verticalDivider,
    horizontalDivider = defaultClassNames.horizontalDivider,
  } = classNames;

  const value = {
    onLayoutChange,
    initialState,
    classNames: {
      layout,
      corner,
      container,
      divider,
      verticalDivider,
      horizontalDivider,
    },
    cornerSize,
    splitRatio,
  };
  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
}

const useConfig = () => React.useContext(ConfigContext);
const useClassNames = () => {
  const { classNames } = useConfig();

  return classNames;
};

export { ConfigContext, useConfig, useClassNames, Provider };
export default {
  useConfig,
  useClassNames,
  Provider,
};
