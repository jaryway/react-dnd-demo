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

const GridWrapper = ({ id, text, index, moveCard, data }) => {
  const ref = useRef(null);
  // console.log('RowWrapper', data);
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragType = item.data.type;
      const hoverType = data.type;
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
      item.data.type = hoverType;
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
  drag(drop(ref));

  return (
    <div className='grid-widget selected' ref={ref}>
      <div className='grid-widget-drag'>
        <Icon type='drag'></Icon>
      </div>
      <Row gutter={2}>
        <Col span={6}>
          <WidgetWrapper>Column</WidgetWrapper>
        </Col>
        <Col span={6}>
          <WidgetWrapper>Column</WidgetWrapper>
        </Col>
        <Col span={6}>
          <WidgetWrapper>Column</WidgetWrapper>
        </Col>
        <Col span={6}>
          <WidgetWrapper>Column</WidgetWrapper>
        </Col>
      </Row>
    </div>
  );
};
export default GridWrapper;
