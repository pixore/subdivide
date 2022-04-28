import React from 'react';
import { createRoot } from 'react-dom/client';

import Subdivide, { ConfigProvider } from '../../src';
import ColorPane from '../components/ColorPane';
import initialState from './initial-state.json';

function App() {
  return (
    <ConfigProvider initialState={initialState}>
      <Subdivide component={ColorPane} />
    </ConfigProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
