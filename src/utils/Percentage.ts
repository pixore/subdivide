type Pixel = number;
type Percentage = number;

const create = (total: Pixel, value: Pixel): Percentage => {
  return (100 * value) / total;
};

const toString = (value: Percentage): string => {
  return `${value}%`;
};

const Percentage = {
  create,
  toString
}

export default Percentage;
