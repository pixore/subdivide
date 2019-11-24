import * as React from 'react';
import { State } from '../layout/types';

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

interface PropTypes {
  initialState?: State;
  onLayoutChange?: (state: State) => void;
  classNames?: OptionalClassNames;
  cornerSize?: number;
  splitRatio?: number;
}

const ConfigContext = React.createContext<ConfigState>(initialValue);

const Provider: React.FC<PropTypes> = (props) => {
  const {
    children,
    initialState,
    onLayoutChange,
    classNames = {},
    cornerSize = initialValue.cornerSize,
    splitRatio = initialValue.splitRatio,
  } = props;

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
};

const useConfig = () => React.useContext(ConfigContext);
const useClassNames = () => {
  const { classNames } = useConfig();

  return classNames;
};

export { ConfigContext };
export default {
  useConfig,
  useClassNames,
  Provider,
};
