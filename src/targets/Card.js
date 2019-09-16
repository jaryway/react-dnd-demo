import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import ItemTypes from '../ItemTypes';

// const style = {
//   border: '1px dashed gray',
//   // padding: '0.5rem 1rem',
//   // marginBottom: '.5rem',
//   backgroundColor: 'white',
//   cursor: 'move'
// };

const Card = ({ data }) => {
  const ref = useRef(null);
  const { id, name } = data;
  const dragItem = { id, data };
  const [, drag] = useDrag({
    item: { ...dragItem, type: ItemTypes.CARD },
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
  drag(ref);

  return (
    <div
      className='ant-list-item ant-list-item-no-flex'
      ref={ref}
      // style={{ ...style, opacity }}
    >
      {name}
    </div>
  );
};
export default Card;
