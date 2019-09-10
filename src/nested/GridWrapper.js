import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Row, Col, Icon } from 'antd';
import ItemTypes from '../ItemTypes';
// import { from } from 'rxjs';
import WidgetWrapper from './WidgetWrapper';

const style = {
  border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  // marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move'
};

const GridWrapper = ({ index, data, moveCard }) => {
  const ref = useRef(null);
  const dragRef = useRef(null);
  // console.log('RowWrapper', data);
  const { id, text, pid } = data;

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,

    /**
     *
     * @param {Object} item Returns a plain object representing the currently dragged item.
     * @param {DropTargetMonitor} monitor
     */
    hover(item, monitor) {
      const isOver = monitor.isOver({ shallow: true });
      // console.log('hover-Grid', item, isOver);
      if (!isOver) return;
      // const { id, text, pid } = data;
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragType = item.data.pid;
      const hoverType = pid;
      // return;
      // item is drag item
      // monitor is DropTargetMonitor getItem 返回 drag 对象的 item
      // console.log(90909, dragIndex === hoverIndex, JSON.stringify({dragType, hoverType}));
      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragType === hoverType) {
        return;
      }

      if (dragType !== hoverType && dragType === 'dest') return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // console.log('hover', index, item.data, data);

      // Time to actually perform the action
      // console.log('index,index', item.index, hoverIndex);
      moveCard(dragIndex, hoverIndex, dragType, hoverType);

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
    item: { type: ItemTypes.CARD, id, index, data },
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
  drop(dragRef);
  drag(dragRef);

  const { elements } = data;

  return (
    <div className='grid-widget' ref={ref} title={text}>
      <div className='grid-widget-drag' ref={dragRef}>
        <Icon type='drag'></Icon>
      </div>
      <Row gutter={2}>
        {elements.map((item, index) => {
          // const { id, text } = item;
          return (
            <Col span={6} key={item.id}>
              <WidgetWrapper
                {...{ key: item.id, index, data: item, moveCard }}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
export default GridWrapper;
