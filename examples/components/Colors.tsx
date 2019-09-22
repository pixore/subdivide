import React from 'react';

const getRandomColorPart = (): number => Math.floor(Math.random() * 200);

const getRandomColor = (): string => {
  const red = getRandomColorPart();
  const green = getRandomColorPart();
  const blue = getRandomColorPart();

  return `rgba(${red}, ${green}, ${blue}, 1)`;
};

const defaultStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

const Colors: React.FC = () => {
  const [color, setColor] = React.useState(() => getRandomColor());
  const style: React.CSSProperties = {
    background: color,
    ...defaultStyle,
  };

  const onClick = () => setColor(getRandomColor());

  return <div style={style} onClick={onClick} />;
};

export default Colors;
