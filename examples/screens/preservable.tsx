import React from 'react';
import { render } from 'react-dom';

import Subdivide from '../../src';
import Config from '../../src/contexts/Config';
import Colors from '../components/Colors';
import { State } from '../../src/layout/types';

const getInitialState = () => {
  try {
    const json = localStorage.getItem('state');
    return JSON.parse(json) as State;
  } catch (error) {
    return undefined;
  }
};

const App: React.FC = () => {
  const initialState = React.useMemo(() => getInitialState(), []);

  const onLayoutChange = (state) => {
    localStorage.setItem('state', JSON.stringify(state));
  };

  return (
    <Config.Provider
      initialState={initialState}
      onLayoutChange={onLayoutChange}
    >
      <Subdivide component={Colors} />
    </Config.Provider>
  );
};

render(<App />, document.getElementById('root'));
