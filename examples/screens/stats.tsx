import React from 'react';
import { createRoot } from 'react-dom/client';

import Subdivide, { useContainer } from '../../src';
import Color from '../components/Color';

function Stats() {
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
}

function App() {
  return <Subdivide component={Stats} />;
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
