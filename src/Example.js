import React from 'react';
// import update from 'immutability-helper';
import { List } from 'antd';
import Card from './Card';

const renderCard = (card, index, moveCard) => {
  return (
    <Card
      key={card.id}
      index={index}
      id={card.id}
      data={card}
      text={card.text}
      moveCard={moveCard}
    />
  );
};

// const style = { width: 400 };

const Container = ({ cards, moveCard, type }) => {
  // console.log('cards[type]', cards, type);
  return (
    <List
      size='small'
      bordered
      dataSource={cards[type].length ? cards[type] : [{ type }]}
      renderItem={(card, i) => renderCard(card, i, moveCard)}
    />
  );
};
export default Container;
