import React, { useState, useCallback } from 'react';
// import GridWrapper from './GridWrapper';
import { Row, Col } from 'antd';
import update from 'immutability-helper';
import GridWrapper from './GridWrapper';

var list = [
  { id: '0-0-0', pid: '0', text: '0-0-0' },
  { id: '0-0-0-1', pid: '0-0-0', text: '0-0-0-1' },

  { id: '0-0-0-0', pid: '0-0-0', text: '0-0-0-0' },
  { id: '0-0-0-2', pid: '0-0-0', text: '0-0-0-2' },
  { id: '0-0-1', pid: '0', text: '0-0-1' },
  //   { id: '0-0', text: '0-0' },
  { id: '0-0-1-0', pid: '0-0-1', text: '0-0-1-0' },
  { id: '0-0-1-1', pid: '0-0-1', text: '0-0-1-1' },
  { id: '0-0-1-2', pid: '0-0-1', text: '0-0-1-2' }
];

var keyEntities = {
  '0': { id: '0', elements: [], text: 'root' }
};

const rawList = list.map(m => ({ ...m }));
rawList.forEach(m => {
  m.parent =
    m.pid && m.pid !== '0' ? list.find(p => p.id === m.pid) : keyEntities['0'];
  if (!m.pid || m.pid === '0') {
    keyEntities['0'].elements.push(m);
  }

  m.elements = list.filter(p => p.pid === m.id);
  keyEntities[m.id] = m;
});

function data2Tree(source, data) {
  return data.map((item, index) => {
    const elements = source.filter(m => m.pid === item.id);
    // const parent = source.find(m => m.id === item.pid);
    // console.log(parent);
    // const pos = [...pPos, index];
    return {
      ...item,
      //   pos,
      //   parent,
      elements: data2Tree(source, elements)
    };
  });
}

const treeData = data2Tree(list, list.filter(m => !m.pid || m.pid === '0'));
console.log(list, treeData, keyEntities);

function treeData2KeyPos(treeData) {
  const keyPos = {};

  const loop = (data, pos) => {
    data.forEach(({ id: key, elements }, index) => {
      keyPos[key] = [...(pos || []), index];
      if (elements.length) loop(elements, keyPos[key]);
    });
  };

  loop(treeData);
  return keyPos;
}

function buildCommand(pos, action) {
  return [...pos].reverse().reduce((prev, curr, index, arr) => {
    if (arr.length === 1) {
      return { ...prev, ...action(curr) };
    }

    if (index === 0) {
      return { ...prev, ...action(curr) };
    }
    return { [curr]: { elements: { ...prev } } };
  }, {});
}

(function testBuilCommand() {
  return;
  var data = [
    {
      id: '0',
      text: '0',
      elements: [
        {
          id: '0-0',
          text: '0-0',
          elements: []
        },
        {
          id: '0-1',
          text: '0-1',
          elements: [
            {
              id: '0-0-0',
              text: '0-0-0',
              elements: []
            },
            {
              id: '0-0-1',
              text: '0-0-1',
              elements: []
            },
            {
              id: '0-0-2',
              text: '0-0-2',
              elements: []
            }
          ]
        }
      ]
    },
    {
      id: '1',
      text: '1',
      elements: [
        {
          id: '1-0',
          text: '1-0',
          elements: []
        },
        {
          id: '1-1',
          text: '1-1',
          elements: [
            {
              id: '1-0-0',
              text: '1-0-0',
              elements: []
            },
            {
              id: '1-0-1',
              text: '1-0-1',
              elements: []
            },
            {
              id: '1-0-2',
              text: '1-0-2',
              elements: []
            }
          ]
        }
      ]
    }
  ];
  const command1 = buildCommand([0, 1, 1], i => ({ $splice: [[i, 1]] }));
  const command2 = buildCommand([1, 1, 0], i => ({
    $splice: [[i, 0, { id: '0-0-t', text: '0-0-t' }]]
  }));
  data = update(data, command1);
  data = update(data, command2);
  //   console.log('testBuildCommand', JSON.stringify(data, null, 2));
})();

const keyPositions = treeData2KeyPos(treeData);

console.log('keyPositions', keyPositions);

function Nested({ data }) {
  const [cards, setCards] = useState(treeData);
  const [keyPos, setKeyPos] = useState(keyPositions);
  //   treeData2KeyPos(treeData)

  const moveCard = useCallback(
    (dragIndex, hoverIndex, dragId, hoverId, dragCard, hoverCard) => {
      const dragPos = keyPos[dragCard.id];
      const hoverPos = keyPos[hoverCard.id];

      const dragCommand = buildCommand(dragPos, i => ({ $splice: [[i, 1]] }));
      const hoverCommand = buildCommand(hoverPos, i => {
        const newCard = {
          ...dragCard,
          pid: hoverCard.pid
        };

        return {
          $splice: [[i, 0, newCard]]
        };
      });

      let nextCards = update(cards, dragCommand);
      nextCards = update(nextCards, hoverCommand);
      const nextKeyPos = treeData2KeyPos(nextCards);

      setCards(nextCards);
      setKeyPos(nextKeyPos);

      console.log(
        'moveCard',
        //   dragCard, hoverCard,
        { dragPos, hoverPos, nextKeyPos, nextCards }
      );
    },
    [cards, keyPos]
  );

  return (
    <>
      {cards.map((item, index) => {
        return (
          <GridWrapper
            {...{ key: item.id, index, data: item, moveCard }}
          ></GridWrapper>
        );
      })}
    </>
  );
}

export default Nested;
