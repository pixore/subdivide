import * as React from 'react';
import { render } from 'react-dom';
import Subdivide, { Config, useContainer, LayoutState } from '../../src';
import Color from '../components/Color';

interface PropTypes {
  id: number;
}

const Panel: React.FC<PropTypes> = (props) => {
  const { id, setState, state } = useContainer();
  const onChange = (color: string) => {
    setState(color);
  };
  return (
    <Color onChange={onChange} initial={state as string}>
      {id}
    </Color>
  );
};

const getInitialState = () => {
  try {
    const json = localStorage.getItem('state');
    return JSON.parse(json) as LayoutState;
  } catch (error) {
    return undefined;
  }
};

const App: React.FC = () => {
  const initialState = React.useMemo(() => getInitialState(), []);

  const onLayoutChange = (state: LayoutState) => {
    localStorage.setItem('state', JSON.stringify(state));
  };

  return (
    <Config.Provider
      initialState={initialState}
      onLayoutChange={onLayoutChange}
    >
      <Subdivide component={Panel} />
    </Config.Provider>
  );
};

render(<App />, document.getElementById('root'));
