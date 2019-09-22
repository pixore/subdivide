import React from 'react';

interface LayoutState {
  rootId: number;
}

const initialState: LayoutState = {
  rootId: 0,
};

const LayoutState = React.createContext<LayoutState>(initialState);
const LayoutActions = React.createContext<{}>({});

const Provider: React.FC = (props) => {
  const { children } = props;
  const [containerList, setContainerList] = React.useState<number[]>([0]);
  const value = {
    rootId: 0,
    containerList,
  };

  return (
    <LayoutActions.Provider value={{}}>
      <LayoutState.Provider value={value}>{children}</LayoutState.Provider>;
    </LayoutActions.Provider>
  );
};

const useLayout = () => React.useContext(LayoutState);

export default {
  Provider,
  useLayout,
};
