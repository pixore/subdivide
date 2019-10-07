import React from 'react';
import Direction from '../utils/Direction';
import Percentage from '../utils/Percentage';

const arrows = {
  left: {
    path: 'M 0 35 H 30 V 25 L 60 50 L 30 75 V 65 H 0',
    align: 'xMinYMid',
  },
  right: {
    path: 'M 100 35 H 70 V 25 L 40 50 L 70 75 V 65 H 100',
    align: 'xMaxYMid',
  },
  bottom: {
    path: 'M 35 0 V 30 H 25 L 50 60 L 75 30 H 65 V 0',
    align: 'xMidYMin',
  },
  top: {
    path: 'M 35 100 V 70 H 25 L 50 40 L 75 70 H 65 V 100',
    align: 'xMidYMax',
  },
};

interface PropTypes {
  top: number;
  left: number;
  width: number;
  height: number;
  direction: Direction;
}

const Overlay: React.FC<PropTypes> = (props) => {
  const { top, left, width, height, direction } = props;
  const { path, align } = arrows[direction];
  const style: React.CSSProperties = {
    position: 'absolute',
    top: Percentage.toString(top),
    left: Percentage.toString(left),
    width: Percentage.toString(width),
    height: Percentage.toString(height),
    background: 'rgba(0, 0 , 0, 0.2)',
  };

  return (
    <div style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio={`${align} meet`}
      >
        <path d={path} stroke="transparent" fill="rgba(255, 255 , 255, 0.1)" />
      </svg>
    </div>
  );
};

export default Overlay;
