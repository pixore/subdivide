import React from 'react';
import { TinyEmitter } from 'tiny-emitter';

import Config from '../contexts/Config';
import Corner from './Corner';
import { dragDirection, Direction } from '../utils';
import {
  Vertical,
  Horizontal,
  FromCorner,
  Size,
  AddContainer,
  NewContainerData,
} from '../types';

type Component = React.ComponentType<any>;

interface PropTypes {
  emitter: TinyEmitter;
  component: Component;
  id: number;
  height?: Size;
  width?: Size;
  top?: number;
  left?: number;
  before: number;
  after: number;
  addContainer: AddContainer;
}

const once = (fn: Function) => {
  let called = false;
  let returnedValue;
  return (...args) => {
    if (!called) {
      called = true;
      returnedValue = fn(...args);
    }

    return returnedValue;
  };
};

const Container: React.FC<PropTypes> = (props) => {
  const elementRef = React.useRef<HTMLDivElement>(null);
  const { splitRatio } = Config.useConfig();
  const { container } = Config.useClassNames();
  const {
    id,
    component: Comp,
    width: initialWidth,
    height: initialHeight,
    addContainer,
    top: initialTop,
    left: initialLeft,
    before,
    after,
    emitter,
  } = props;
  const [width, setWidth] = React.useState<number>();
  const [height, setHeight] = React.useState<number>();
  const [top, setTop] = React.useState<number>(initialTop || 0);
  const [left, setLeft] = React.useState<number>(initialLeft || 0);
  const style: React.CSSProperties = {
    width: width || initialWidth,
    height: height || initialHeight,
    top,
    left,
  };
  const siblingsRef = React.useRef({
    before,
    after,
  });

  siblingsRef.current = {
    before,
    after,
  };

  const setSize = (deltaX: number, deltaY: number, direction: Direction) => {
    if (direction === Vertical.TOP) {
      setHeight((height) => (height as number) + deltaY);
    }

    if (direction === Vertical.BOTTOM) {
      setTop((top) => top + deltaY);
      setHeight((height) => (height as number) - deltaY);
    }

    if (direction === Horizontal.LEFT) {
      setWidth((width) => (width as number) + deltaX);
    }

    if (direction === Horizontal.RIGHT) {
      setLeft((left) => left + deltaX);
      setWidth((width) => (width as number) - deltaX);
    }
  };

  const split = (direction: Direction) => {
    if (!height || !width) {
      return;
    }

    const isVertical =
      direction === Vertical.BOTTOM || direction === Vertical.TOP;
    console.log(isVertical, direction);
    const newDataContainer: { [k: string]: any } = {
      parent: id,
    };

    if (isVertical) {
      const newHeight = height - splitRatio;

      setHeight(newHeight);

      newDataContainer.width = width;
      newDataContainer.height = splitRatio;

      if (direction === Vertical.BOTTOM) {
        setTop(top + splitRatio);

        newDataContainer.top = top;
        newDataContainer.left = left;
      } else {
        newDataContainer.top = top + newHeight;
        newDataContainer.left = left;
      }
    } else {
      const newWidth = width - splitRatio;

      setWidth(newWidth);

      newDataContainer.width = splitRatio;
      newDataContainer.height = height;

      if (direction === Horizontal.RIGHT) {
        setLeft(left + splitRatio);

        newDataContainer.top = top;
        newDataContainer.left = left;
      } else {
        newDataContainer.top = top;
        newDataContainer.left = left + newWidth;
      }
    }

    return addContainer(newDataContainer as NewContainerData);
  };

  const onStartDrag = (fromCorner: FromCorner) => {
    const { vertical, horizontal, x: fromX, y: fromY } = fromCorner;
    const from = {
      x: fromX,
      y: fromY,
    };

    const corner = {
      vertical,
      horizontal,
    };

    const onceSplit = once(split);
    let direction;

    const onMouseMove = (event: MouseEvent) => {
      const { clientX: toX, clientY: toY } = event;
      const to = {
        x: toX,
        y: toY,
      };

      if (!direction) {
        direction = dragDirection(corner, from, to, splitRatio);
        if (direction) {
          from.x = to.x;
          from.y = to.y;
        }
        return;
      }

      const newContainer = onceSplit(direction);
      const deltaX = to.x - from.x;
      const deltaY = to.y - from.y;

      setSize(deltaX, deltaY, direction);

      emitter.emit(`resize-${newContainer}`, deltaX, deltaY, direction);

      if (direction) {
        from.x = to.x;
        from.y = to.y;
      }
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  React.useEffect(() => {
    const { current: element } = elementRef;

    if (!element) {
      return;
    }

    setWidth((currentWidth) => {
      if (!currentWidth) {
        const { clientWidth } = element;
        return clientWidth;
      }

      return currentWidth;
    });

    setHeight((currentHeight) => {
      if (!currentHeight) {
        const { clientHeight } = element;
        return clientHeight;
      }

      return currentHeight;
    });
  }, []);

  React.useEffect(() => {
    const onResize = (deltaX: number, deltaY: number, direction: Direction) => {
      setSize(
        deltaX,
        deltaY,
        direction === Vertical.TOP
          ? Vertical.BOTTOM
          : direction === Vertical.BOTTOM
          ? Vertical.TOP
          : direction === Horizontal.LEFT
          ? Horizontal.RIGHT
          : Horizontal.LEFT,
      );
    };
    emitter.on(`resize-${id}`, onResize);

    return () => {
      emitter.off(`resize-${id}`, onResize);
    };
  }, [id, emitter]);

  return (
    <div ref={elementRef} className={container} style={style}>
      <Comp />
      <Corner
        onStartDrag={onStartDrag}
        vertical={Vertical.TOP}
        horizontal={Horizontal.LEFT}
      />
      <Corner
        onStartDrag={onStartDrag}
        vertical={Vertical.TOP}
        horizontal={Horizontal.RIGHT}
      />
      <Corner
        onStartDrag={onStartDrag}
        vertical={Vertical.BOTTOM}
        horizontal={Horizontal.RIGHT}
      />
      <Corner
        onStartDrag={onStartDrag}
        vertical={Vertical.BOTTOM}
        horizontal={Horizontal.LEFT}
      />
    </div>
  );
};

export default Container;
