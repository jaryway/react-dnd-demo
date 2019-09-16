import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import classNames from 'classnames';
import ItemTypes from '../ItemTypes';
import DragTypes from '../DragTypes';
import * as components from './components';
import { canDrop } from './utils';

const CellWrapper = ({ index, data, moveCard, updateCard }) => {
  const ref = useRef(null);

  const { id, pid } = data;

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect: monitor => ({
      isOver: monitor.isOver({ shallow: true })
    }),
    hover(item, monitor) {
      const isOver = monitor.isOver({ shallow: true });

      console.log('canDrop', canDrop(item, data));
      if (!canDrop(item, data)) return;

      if (!isOver) return;

      if (!ref.current) return;

      return;

      const dragIndex = item.index;
      const hoverIndex = index;
      // const dragId = item.data.id;
      // const hoverId = id;
      const dragType = item.data.pid;
      const hoverType = pid;
      const dragCard = item.data;
      const hoverCard = data;
      // monitor is DropTargetMonitor getItem 返回 drag 对象的 item
      // console.log(90909, dragIndex === hoverIndex);
      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragType === hoverType) return;

      // console.log('hover', index, item.data, data);

      // Time to actually perform the action
      // console.log('index,index', item.index, hoverIndex);
      moveCard(dragCard, hoverCard);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.data.pid = hoverType;
    },
    drop(item, monitor) {
      const isOver = monitor.isOver({ shallow: true });

      if (!isOver) return;

      if (item.data.id === id) return;
      console.log('targets-drop-cell', item.data, data);
      moveCard(item.data, data);
    }
    // canDrop(item, monitor) {
    //   return canDrop(item, data);
    // }
  });

  const dragItem = { id, index, data };
  const [{ isDragging }, drag] = useDrag({
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
    canDrag(monitor) {
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
