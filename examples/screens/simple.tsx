import React from 'react';
import { render } from 'react-dom';

import Subdivide from '../../src';
import ColorPane from '../components/ColorPane';

const App: React.FC = () => {
  return <Subdivide component={ColorPane} />;
};

render(<App />, document.getElementById('root'));
