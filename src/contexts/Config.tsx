import * as React from 'react';

interface ClassNames {
  corner: string;
  container: string;
}

interface OptionalClassNames {
  corner?: string;
  container?: string;
}

const defaultClassNames = {
  corner: 'ps-corner',
  container: 'ps-container',
};

const initialValue = {
  classNames: defaultClassNames,
  cornerSize: 40,
  splitRatio: 40,
};

export interface ConfigState {
  classNames: ClassNames;
  cornerSize: number;
  splitRatio: number;
}

interface PropTypes {
  classNames?: OptionalClassNames;
  cornerSize?: number;
  splitRatio?: number;
}

const ConfigContext = React.createContext<ConfigState>(initialValue);

const Provider: React.FC<PropTypes> = (props) => {
  const {
    children,
    classNames = {},
    cornerSize = initialValue.cornerSize,
    splitRatio = initialValue.splitRatio,
  } = props;

  const {
    corner = defaultClassNames.corner,
    container = defaultClassNames.container,
  } = classNames;

  const value = {
    classNames: {
      corner,
      container,
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
