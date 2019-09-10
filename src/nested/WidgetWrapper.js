import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import ItemTypes from '../ItemTypes';

// const style = {
//   border: '1px dashed gray',
//   // padding: '0.5rem 1rem',
//   // marginBottom: '.5rem',
//   backgroundColor: 'white',
//   cursor: 'move'
// };

const WidgetWrapper = ({ index, data, moveCard }) => {
  const ref = useRef(null);
  // console.log('WidgetWrapper', data);

  const { id, text, pid } = data;

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      const isOver = monitor.isOver({ shallow: true });

      // console.log('hover-Widget', item, isOver);

      if (!isOver) return;

      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const dragId = item.data.id;
      const hoverId = id;
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
      moveCard(dragIndex, hoverIndex, dragId, hoverId, dragCard, hoverCard);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
      item.data.pid = hoverType;
    },
    drop(item) {
      // onDrop(item, item.originType);
    }
    // drop(item, monitor) {
    //   console.log('drop', index, item.data, data);
    // }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, index, data },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    }),
    begin(monitor) {
      // console.log('begin', data);
    },
    end(item, monitor) {
      // console.log('end', item.data, data);
    }
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div className='grid-widget-item' ref={ref}>
      {text}
    </div>
  );
};
export default WidgetWrapper;
