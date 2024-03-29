import React from 'react';

const getRandomColorPart = (): number => Math.floor(Math.random() * 200);

const getRandomColor = (): string => {
  const red = getRandomColorPart();
  const green = getRandomColorPart();
  const blue = getRandomColorPart();

  return `rgba(${red}, ${green}, ${blue}, 1)`;
};

const spanStyle: React.CSSProperties = {
  background: 'white',
};

const defaultStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 40,
};

interface PropTypes {
  initial?: string;
  onChange?: (color: string) => void;
  children: React.ReactNode;
}

const noop = () => undefined;

function Color(props: PropTypes) {
  const { children, initial, onChange = noop } = props;
  const [color, setColor] = React.useState<string>(
    () => initial || getRandomColor(),
  );
  const style: React.CSSProperties = {
    background: color,
    ...defaultStyle,
  };

  React.useEffect(() => onChange(color), [color]);

  const onClick = () => setColor(getRandomColor());

  return (
    <div style={style} onClick={onClick}>
      <span style={spanStyle}>{children}</span>
    </div>
  );
}

export default Color;
