import React from 'react';
import Color from './Color';
import { useContainer } from '../../src';

function ColorPane() {
  const { id } = useContainer();

  return <Color>{id}</Color>;
}

export default ColorPane;
