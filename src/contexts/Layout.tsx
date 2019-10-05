import React from 'react';
import { ReadOnlyState } from '../hooks/useLayout/types';
import { initialState } from '../hooks/useLayout';
import { ContainersMap, DividersMap, DeepReadonly } from '../types';
import Id from 'src/utils/Id';

const LayoutState = React.createContext<ReadOnlyState>(initialState);

interface PropTypes {
  containers: DeepReadonly<ContainersMap>;
  dividers: DeepReadonly<DividersMap>;
  rootId: Id;
}

const Provider: React.FC<PropTypes> = (props) => {
  const { children, ...value } = props;

  return <LayoutState.Provider value={value}>{children}</LayoutState.Provider>;
};

const useLayout = () => React.useContext(LayoutState);

export default {
  Provider,
  useLayout,
};
