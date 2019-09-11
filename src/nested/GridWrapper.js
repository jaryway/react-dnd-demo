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

const GridWrapper = ({ index, data, moveCard, updateCard }) => {
  const ref = useRef(null);
  const dragRef = useRef(null);
  // console.log('RowWrapper', data);
  const { id, text, pid, elements, cols } = data;

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

  // const opacity = isDragging ? 0 : 1;
  // drop(dragRef);
  // grid 组件不能放入组件，只有里面的 Col 才能 drag and drop
  // 当 Col 是为空组件时才能放入新组件，否只能拖拽排序
  // 当 Col 不是空组件时，只能排序
  drag(dragRef);

  // const { elements, cols } = data;

  return (
    <div key={id} className='grid-widget' ref={ref}>
      <div className='grid-widget-drag' ref={dragRef}>
        <Icon type='drag'></Icon>
      </div>
      <Row gutter={2}>
        {elements.map((item, index) => {
          // if (item._hidden) return null;
          return (
            <Col
              style={item._hidden ? { display: 'none' } : {}}
              span={6}
              key={item.id}
            >
              <WidgetWrapper
                {...{ key: item.id, index, data: item, moveCard, updateCard }}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
export default GridWrapper;
