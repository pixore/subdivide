import * as React from 'react';
import { render } from 'react-dom';

import Subdivide, { ConfigProvider } from '../../src';
import ColorPane from '../components/ColorPane';
import initialState from './initial-state.json';

const App: React.FC = () => {
  return (
    <ConfigProvider initialState={initialState}>
      <Subdivide component={ColorPane} />
    </ConfigProvider>
  );
};

render(<App />, document.getElementById('root'));
