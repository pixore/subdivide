import React from 'react';
import { createRoot } from 'react-dom/client';
import Subdivide, {
  ConfigProvider,
  useContainer,
  LayoutState,
} from '../../src';
import Color from '../components/Color';

function Panel() {
  const { id, setState, state } = useContainer();
  const onChange = (color: string) => {
    setState(color);
  };
  return (
    <Color onChange={onChange} initial={state as string}>
      {id}
    </Color>
  );
}

const getInitialState = () => {
  try {
    const json = localStorage.getItem('state');
    return JSON.parse(json) as LayoutState;
  } catch (error) {
    return undefined;
  }
};

function App() {
  const initialState = React.useMemo(() => getInitialState(), []);

  const onLayoutChange = (state: LayoutState) => {
    localStorage.setItem('state', JSON.stringify(state));
  };

  return (
    <ConfigProvider initialState={initialState} onLayoutChange={onLayoutChange}>
      <Subdivide component={Panel} />
    </ConfigProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
