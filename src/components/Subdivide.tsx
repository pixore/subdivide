import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Container from './Container';
import { ContainerData, AddContainer } from '../types';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const emitter = React.useMemo(() => new TinyEmitter(), []);
  const [newContainer, setNewContainer] = React.useState<ContainerData>({
    id: 0,
    top: 0,
    left: 0,
    parent: -1,
    width: '100%',
    height: '100%',
  });

  const [containers, setContainers] = React.useState<number[]>([]);
  const { id: newContainerId } = newContainer;
  React.useEffect(() => {
    setContainers((currentContainers) => {
      if (currentContainers.includes(newContainerId)) {
        return currentContainers;
      }
      return currentContainers.concat(newContainerId);
    });
  }, [newContainerId]);

  const addContainer: AddContainer = ({ parent, width, height, top, left }) => {
    const id = containers.length;
    setNewContainer({
      id,
      parent,
      height,
      width,
      top,
      left,
    });

    return id;
  };

  const isNewContainer = !containers.includes(newContainer.id);

  const containerList = isNewContainer
    ? containers.concat(newContainer.id)
    : containers;

  return (
    <>
      {containerList.map((id) => {
        const isNew = newContainer.id === id && isNewContainer;
        const props = {
          addContainer,
          emitter,
          key: id,
          id,
          component,
          ...(isNew ? newContainer : {}),
        };
        return <Container {...props} />;
      })}
    </>
  );
};

export default Subdivide;
