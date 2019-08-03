import 'antd/dist/antd.css';

import React, { useState, useCallback, useEffect, useRef } from 'react';
// import logo from './logo.svg';
import './App.css';
import { List, Row, Col } from 'antd';

import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import DragSourceWrapper from './DragSourceWrapper';
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
    type => (dragIndex, hoverIndex, dragData) => {
      const hoverCards = cards[type];
      const dragCard = hoverCards[dragIndex];
      const hoverCard = hoverCards[hoverIndex];

      if (dragIndex < 0 || hoverIndex < 0) return;

      let actions = [[dragIndex, 1], [hoverIndex, 0, dragCard]];

      if (hoverCard.type !== dragData.type) {
        // dragData = { ...dragData, type: hoverCard.type };
        actions = [[hoverIndex, 0, dragData]];
      }

      // console.log('cardsqqq', data, hoverCards, dragCard.type, dragData.type);
      setCards({
        ...cards,
        [type]: update(hoverCards, {
          $splice: actions
        })
      });
    },
    [cards]
  );

  const updateCard = useCallback(
    type => (dragCard, dragIndex) => {
      const hoverCards = cards[type];
      const dragCards = cards[dragCard.type];

      console.log('updateCard ', dragCard.type, type, dragIndex);

      if (dragCard.type === type || dragIndex < 0) return;

      const hoverIndex = hoverCards.findIndex(m => m.id === dragCard.id);

      setCards(() => ({
        ...cards,
        [type]: update(hoverCards, {
          [hoverIndex]: { $set: { ...dragCard, type } }
        }),

        [dragCard.type]: update(dragCards, {
          $splice: [[dragIndex, 1]]
        })
      }));
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
              <Example
                cards={cards}
                moveCard={moveCard(1)}
                updateCard={updateCard(1)}
                type={1}
              />
            </Col>
            <Col md={6}>
              <Example
                cards={cards}
                moveCard={moveCard(2)}
                updateCard={updateCard(2)}
                type={2}
              />
            </Col>
            <Col md={6}>1</Col>
            <Col md={6}>1</Col>
          </Row>
        </div>
      </DndProvider>
    </>
  );
}

export default App;
