import * as React from 'react';
import Color from './Color';
import { useContainer } from '../../src';

const ColorPane: React.FC = () => {
  const { id } = useContainer();

  return <Color>{id}</Color>;
};

export default ColorPane;
