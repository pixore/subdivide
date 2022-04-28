import React from 'react';
import { createRoot } from 'react-dom/client';

import Subdivide from '../../src';
import ColorPane from '../components/ColorPane';

const App: React.FC = () => {
  return (
    <>
      <Subdivide
        component={ColorPane}
        width={600}
        height={600}
        top={30}
        left={30}
      />
      <Subdivide component={ColorPane} top={30} left={700} />
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
