type Pixel = number;
type Percentage = number;

const create = (total: Pixel, value: Pixel): Percentage => {
  return (100 * value) / total;
};

const toString = (value: Percentage): string => {
  return `${value}%`;
};

const toPixels = (total: Pixel, value: Percentage): Pixel => {
  return (value * total) / 100;
};

const ofPercentage = (value: Percentage, total: Percentage): Percentage => {
  return value * (100 / total);
};

const Percentage = {
  ofPercentage,
  create,
  toString,
  toPixels,
};

export default Percentage;
