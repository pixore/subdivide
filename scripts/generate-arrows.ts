import Direction from '../src/utils/Direction';

const bodyHeight = 30;
const bodyWidth = 30;
const arrowHeight = 50;
const arrowWidth = 30;

const generateArrows = () => {
  const moveTo = (x: number, y: number) => `M ${x} ${y}`;
  const lineTo = (x: number, y: number) => `L ${x} ${y}`;
  const horizontalLineTo = (x: number) => `H ${x}`;
  const verticalLineTo = (x: number) => `V ${x}`;
  const arrows = {
    [Direction.LEFT]: {
      path: [
        moveTo(0, 50 - bodyHeight / 2),
        horizontalLineTo(bodyWidth),
        verticalLineTo(50 - arrowHeight / 2),
        lineTo(arrowWidth + arrowWidth, 50),
        lineTo(bodyWidth, arrowHeight / 2 + 50),
        verticalLineTo(bodyHeight / 2 + 50),
        horizontalLineTo(0),
      ].join(' '),
      align: 'xMinYMid',
    },
    [Direction.RIGHT]: {
      path: [
        moveTo(100, 50 - bodyHeight / 2),
        horizontalLineTo(100 - bodyWidth),
        verticalLineTo(50 - arrowHeight / 2),
        lineTo(100 - (arrowWidth + arrowWidth), 50),
        lineTo(100 - bodyWidth, arrowHeight / 2 + 50),
        verticalLineTo(bodyHeight / 2 + 50),
        horizontalLineTo(100),
      ].join(' '),
      align: 'xMaxYMid',
    },
    [Direction.BOTTOM]: {
      path: [
        moveTo(50 - bodyHeight / 2, 0),
        verticalLineTo(bodyWidth),
        horizontalLineTo(50 - arrowHeight / 2),
        lineTo(50, arrowWidth + arrowWidth),
        lineTo(arrowHeight / 2 + 50, bodyWidth),
        horizontalLineTo(bodyHeight / 2 + 50),
        verticalLineTo(0),
      ].join(' '),
      align: 'xMidYMin',
    },
    [Direction.TOP]: {
      path: [
        moveTo(50 - bodyHeight / 2, 100),
        verticalLineTo(100 - bodyWidth),
        horizontalLineTo(50 - arrowHeight / 2),
        lineTo(50, 100 - (arrowWidth + arrowWidth)),
        lineTo(arrowHeight / 2 + 50, 100 - bodyWidth),
        horizontalLineTo(bodyHeight / 2 + 50),
        verticalLineTo(100),
      ].join(' '),
      align: 'xMidYMax',
    },
  };
  return arrows;
};

console.log(JSON.stringify(generateArrows()));
