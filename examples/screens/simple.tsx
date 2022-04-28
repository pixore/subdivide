import React from 'react';
import { createRoot } from 'react-dom/client';

import Subdivide from '../../src';
import ColorPane from '../components/ColorPane';

function App() {
  return <Subdivide component={ColorPane} />;
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
