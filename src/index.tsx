import Subdivide from './components/Subdivide';
import Config from './contexts/Config';
import { useContainer } from './components/Container';
import { State } from './layout/types';

export default Subdivide;

export type LayoutState = State;

export { Config, useContainer };
