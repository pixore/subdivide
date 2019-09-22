import React from 'react';
import { render } from 'react-dom';

import Subdivide from '../../src';
import Colors from '../components/Colors';

const App: React.FC = () => {
  return <Subdivide component={Colors} />;
};

render(<App />, document.getElementById('root'));
