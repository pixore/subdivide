import React from 'react';
import Color from './Color';

interface PropTypes {
  id: number;
}

const ColorPane: React.FC<PropTypes> = (props) => {
  const { id } = props;

  return <Color>{id}</Color>;
};

export default ColorPane;
