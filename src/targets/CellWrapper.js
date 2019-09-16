import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import classNames from 'classnames';
import ItemTypes from '../ItemTypes';
import DragTypes from '../DragTypes';
import * as components from './components';
import { canDrop } from './utils';

const CellWrapper = ({ index, data, moveCard, updateCard }) => {
  const ref = useRef(null);

  const { id } = data;

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect: monitor => {
      const item = monitor.getItem();
      const isOver = monitor.isOver({ shallow: true });
      return { isOver: isOver && item.id !== data.id };
    },
    // hover(item, monitor) {
    //   const isOver = monitor.isOver({ shallow: true });

    //   // console.log('canDrop', canDrop(item, data));
    //   // if (!canDrop(item, data)) return;

    //   if (!isOver) return;

    //   if (!ref.current) return;

    //   return;
    // },
    drop(item, monitor) {
      const isOver = monitor.isOver({ shallow: true });

      if (!isOver) return;

      if (item.data.id === id) return;

      console.log('targets-drop-cell', item.data, data);
      moveCard(item.data, data);
    },
    canDrop(item) {
      return canDrop(item, data);
    }
  });

  const dragItem = { id, index, data };
  const [, drag] = useDrag({
    item: { ...dragItem, type: ItemTypes.CARD, dragType: DragTypes.GRID_COL },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
    // begin(monitor) {
    //   // console.log('begin', data);
    // },
    // end(item, monitor) {
    //   // console.log('end', item.data, data);
    // },
    canDrag() {
      // empty 组件不能拖拽
      return data.type !== '__empty__';
    }
  });

  // const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  // console.log(isOvering, 'collectedProps');
  const WidgetComponent = components[data.type];

  return (
    <div
      className={classNames('grid-widget-item', { hover: isOver })}
      ref={ref}
    >
      {WidgetComponent && <WidgetComponent data={data} />}
    </div>
  );
};
export default CellWrapper;
