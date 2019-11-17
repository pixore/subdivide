import React from 'react';
import { render } from 'react-dom';

import Subdivide from '../../src';
import Config from '../../src/contexts/Config';
import Colors from '../components/Colors';
import initialState from './initial-state.json';

const App: React.FC = () => {
  return <Config.Provider initialState={initialState}>
    <Subdivide component={Colors} />
  </Config.Provider>
};

render(<App />, document.getElementById('root'));
