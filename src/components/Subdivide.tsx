import React from 'react';
import { TinyEmitter } from 'tiny-emitter';
import Container from './Container';
import { ContainerData, Size, AddContainer } from '../types';

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

  console.log(newContainer.id, containers);

  return (
    <>
      {containerList.map((id, index) => {
        const before = containers[index - 1];
        const after = containers[index + 1];
        if (newContainer.id === id && isNewContainer) {
          return (
            <Container
              addContainer={addContainer}
              before={before}
              after={after}
              emitter={emitter}
              key={id}
              {...newContainer}
              component={component}
            />
          );
        }

        return (
          <Container
            addContainer={addContainer}
            before={before}
            after={after}
            emitter={emitter}
            key={id}
            id={id}
            component={component}
          />
        );
      })}
    </>
  );
};

export default Subdivide;
