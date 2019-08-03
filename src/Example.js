import React, { useState, useCallback, useEffect, useRef } from 'react';
import update from 'immutability-helper';
import { List } from 'antd';
import Card from './Card';

// const style = { width: 400 };



const Container = ({ cards,moveCard,updateCard, type }) => {
  {
    

    const renderCard = (card, index) => {
      //   console.log('dddd', index);
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          data={card}
          // cardType={card.type}
          text={card.text}
          moveCard={moveCard}
          updateCard={updateCard}
          onDrop={(item, index) => {
            updateCard(item.data, index);
            // console.log('onDrop', index, item.data, card, item.data === card);
          }}
        />
      );
    };
    console.log('cards[type]', cards, type);
    return (
      <List
        size='small'
        bordered
        dataSource={cards[type]}
        renderItem={(card, i) => renderCard(card, i)}
      />
    );
  }
};
export default Container;
