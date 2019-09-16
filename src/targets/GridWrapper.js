import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import classNames from 'classnames';
import { Row, Col, Icon } from 'antd';
import ItemTypes from '../ItemTypes';
// import DragTypes from '../DragTypes';
// import { canDrop } from './utils';
import CellWrapper from './CellWrapper';

const GridWrapper = ({
  index,
  data,
  moveCard,
  updateCard,
  selectCard,
  selectMap
}) => {
  const ref = useRef(null);
  const dragRef = useRef(null);
  // console.log('RowWrapper', data);
  const { id, elements } = data;

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect: monitor => {
      const item = monitor.getItem();
      const isOver = monitor.isOver({ shallow: true });
      return { isOver: isOver && item.id !== data.id };
    },

    drop(item, monitor) {
      const isOver = monitor.isOver({ shallow: true });
      if (!isOver) return;

      if (item.data.id === id) return;
      console.log('targets-drop-grid', item.data, data);
      moveCard(item.data, data);
    }
    // canDrop(item, monitor) {
    //   return canDrop(item, data);
    // }
  });

  const [, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index, data },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
    // begin(monitor) {
    //   // console.log('begin', data);
    // },
    // end(item, monitor) {
    //   // console.log('end', item.data, data);
    // }
  });

  // const opacity = isDragging ? 0 : 1;
  // grid 组件不能放入组件，只有里面的 Col 才能 drag and drop
  // 当 Col 是为空组件时才能放入新组件，否只能拖拽排序
  // 当 Col 不是空组件时，只能排序

  // drop(!selectMap[id] && ref);
  // drag(dragRef);
  drag(drop(ref));

  // console.log(!selectMap[id],keyPos);

  return (
    <div
      key={id}
      className={classNames('grid-widget', {
        selected: selectMap[id],
        hover: isOver
      })}
      ref={ref}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        selectCard(id);
      }}
    >
      <div className='grid-widget-drag' ref={dragRef}>
        <Icon type='drag'></Icon>
      </div>
      <Row gutter={2}>
        {elements.map((item, index) => {
          // if (item._hidden) return null;
          return (
            <Col
              span={8}
              key={item.id}
              style={item._hidden ? { display: 'none' } : {}}
              className={classNames('grid-widget-col', {
                selected: selectMap[item.id]
              })}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                selectCard(item.id);
              }}
            >
              <CellWrapper {...{ index, data: item, moveCard, updateCard }} />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
export default GridWrapper;
