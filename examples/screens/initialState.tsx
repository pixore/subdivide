import * as React from 'react';
import { render } from 'react-dom';

import Subdivide, { Config } from '../../src';
import ColorPane from '../components/ColorPane';
import initialState from './initial-state.json';

const App: React.FC = () => {
  return (
    <Config.Provider initialState={initialState}>
      <Subdivide component={ColorPane} />
    </Config.Provider>
  );
};

render(<App />, document.getElementById('root'));
