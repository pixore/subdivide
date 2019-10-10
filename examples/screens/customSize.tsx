import React from 'react';
import { render } from 'react-dom';

import Subdivide from '../../src';
import Colors from '../components/Colors';

const App: React.FC = () => {
  return <div style={{ position: 'relative', left: 30, top: 30}}>
    <Subdivide component={Colors} width={600} height={600} top={30} left={30} />
  </div>
};

render(<App />, document.getElementById('root'));