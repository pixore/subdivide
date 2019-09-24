import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Container from './Container';
import { ContainerData, AddContainer, ID } from '../types';

type Component = React.ComponentType<any>;

interface PropTypes {
  component: Component;
}

type UseContainers = {
  containers: ID[];
  newContainer: ContainerData;
  setNewContainer: React.Dispatch<React.SetStateAction<ContainerData>>;
};

const useContainers = (): UseContainers => {
  const [newContainer, setNewContainer] = React.useState<ContainerData>({
    id: 0,
    top: 0,
    left: 0,
    parent: -1,
    width: '100%',
    height: '100%',
  });
  const { id: newContainerId } = newContainer;
  const [containers, setContainers] = React.useState<ID[]>([]);

  React.useEffect(() => {
    setContainers((currentContainers) => {
      if (currentContainers.includes(newContainerId)) {
        return currentContainers;
      }
      return currentContainers.concat(newContainerId);
    });
  }, [newContainerId]);

  const isNewContainer = !containers.includes(newContainer.id);

  return {
    containers: isNewContainer
      ? containers.concat(newContainer.id)
      : containers,
    setNewContainer,
    newContainer,
  };
};

const Subdivide: React.FC<PropTypes> = (props) => {
  const { component } = props;
  const emitter = React.useMemo(() => new TinyEmitter(), []);

  const { containers, setNewContainer, newContainer } = useContainers();

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

  return (
    <>
      {containers.map((id) => {
        const isNew = newContainer.id === id;
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
