import React from 'react';
import { render } from 'react-dom';

import Subdivide, { useContainer } from '../../src';
import Color from '../components/Color';

const Stats: React.FC = () => {
  const { stats } = useContainer();

  if (!stats) {
    return <Color>loading...</Color>;
  }
  return (
    <Color>
      <div>width: {stats.width}</div>
      <div>height: {stats.height}</div>
      <div>left: {stats.left}</div>
      <div>top: {stats.top}</div>
    </Color>
  );
};

const App: React.FC = () => {
  return <Subdivide component={Stats} />;
};

render(<App />, document.getElementById('root'));
