import 'antd/dist/antd.css';

import React, { useState, useCallback, useEffect, useRef } from 'react';
// import ReactDOM from 'ReactDOM';
// import logo from './logo.svg';
import './App.css';
import { List, Row, Col } from 'antd';

import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

// import DragSourceWrapper from './DragSourceWrapper';
import Example from './Example';

import update from 'immutability-helper';

// const data = [
//   'Racing car sprays burning fuel into crowd.',
//   'Japanese princess to wed commoner.',
//   'Australian walks 100km after outback crash.',
//   'Man charged over missing wedding girl.',
//   'Los Angeles battles huge wildfires.'
// ];
const data1 = [
  { id: 1, text: 'Write a cool JS library' },
  { id: 2, text: 'Make it generic enough' },
  { id: 3, text: 'Write README' },
  { id: 4, text: 'Create some examples' },
  {
    id: 5,
    text:
      'Spam in Twitter and IRC to promote it (note that this element is taller than the others)'
  },
  { id: 6, text: '???' },
  { id: 7, text: 'PROFIT' }
];

const newId = () =>
  Math.random()
    .toString(16)
    .slice(2);

const data = {
  1: data1.map(m => {
    const id = newId();
    return {
      ...m,
      id,
      text: id,
      type: 1
    };
  }),
  2: data1.map(m => {
    const id = newId();
    return {
      ...m,
      id,
      text: id,
      type: 2
    };
  })
};

function App() {
  const [cards, setCards] = useState(data);
  // const cardsRef = useRef();

  // useEffect(() => {
  //   cardsRef.current = cards;
  //   console.log('useEffect', cardsRef, cards);
  // });

  const moveCard = useCallback(
    (dragIndex, hoverIndex, dragType, hoverType) => {
      const hoverCards = cards[hoverType];
      const dragCards = cards[dragType];
      const dragCard = dragCards[dragIndex];

      console.log('moveCard', dragType, hoverType, dragIndex, hoverIndex);

      if (dragIndex < 0 || hoverIndex < 0) return;

      setCards({
        ...cards,
        ...(dragType === hoverType
          ? {
              [dragType]: update(dragCards, {
                $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
              })
            }
          : {
              [dragType]: update(dragCards, {
                $splice: [[dragIndex, 1]]
              }),
              [hoverType]: update(hoverCards, {
                $splice: [[hoverIndex, 0, dragCard]]
              })
            })
      });

      // if (dragType === hoverType) {
      //   setCards({
      //     ...cards,
      //     [dragType]: update(dragCards, {
      //       $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
      //     })
      //   });
      // } else {
      //   setCards({
      //     ...cards,
      //     [dragType]: update(dragCards, {
      //       $splice: [[dragIndex, 1]]
      //     }),
      //     [hoverType]: update(hoverCards, {
      //       $splice: [[hoverIndex, 0, dragData]]
      //     })
      //   });
      // }
    },
    [cards]
  );

  return (
    <>
      {/* <Form /> */}
      <DndProvider backend={HTML5Backend}>
        <div className='app' style={{ margin: 60 }}>
          <Row gutter={16}>
            <Col md={6}>
              <Example cards={cards} moveCard={moveCard} type={1} />
            </Col>
            <Col md={6}>
              <Example cards={cards} moveCard={moveCard} type={2} />
            </Col>
            <Col md={6}>{/* <button onClick={_onPrint}>Print</button> */}</Col>
            <Col md={6}>1</Col>
          </Row>
        </div>
      </DndProvider>
    </>
  );
}

export default App;
