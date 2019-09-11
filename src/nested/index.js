import React, { useState, useCallback } from 'react';
// import GridWrapper from './GridWrapper';
import { Row, Col } from 'antd';
import update from 'immutability-helper';
import GridWrapper from './GridWrapper';

var list = [
  { id: '0-0-0', cols: 3, pid: '0', text: '0-0-0' },
  { id: '0-0-0-1', pid: '0-0-0', text: '0-0-0-1' },

  { id: '0-0-0-0', pid: '0-0-0', text: '0-0-0-0' },
  { id: '0-0-0-2', pid: '0-0-0', text: '0-0-0-2' },
  { id: '0-0-1', cols: 4, pid: '0', text: '0-0-1' },
  //   { id: '0-0', text: '0-0' },
  { id: '0-0-1-0', pid: '0-0-1', text: '0-0-1-0' },
  { id: '0-0-1-1', pid: '0-0-1', text: '0-0-1-1' },
  { id: '0-0-1-2', pid: '0-0-1', text: '0-0-1-2' }
];

const rawData = [
  {
    id: '185',
    type: 'grid',
    name: '栅格布局',
    icon: 'icon-grid-',
    cols: 3,
    elements: [
      {
        id: '1854',
        pid: '185',
        type: 'input',
        name: '单行文本1',
        icon: 'icon-input'
      },
      { id: '1a476fdeb8582', pid: '185', name: 'empty', type: 'input' },
      {
        id: '1856',
        pid: '185',
        type: 'input',
        name: '单行文本2',
        icon: 'icon-input'
      }
    ]
  },
  { id: '1857', type: 'input', name: '单行文本1', icon: 'icon-input' },
  {
    id: '187',
    type: 'grid',
    name: '栅格布局',
    icon: 'icon-grid-',
    cols: 3,
    elements: [
      {
        id: '1874',
        pid: '187',
        type: '__empty__',
        name: 'empty'
        // icon: 'icon-input'
      },
      {
        id: '1855',
        pid: '187',
        type: 'input',
        name: '单行文本1',
        icon: 'icon-input'
      },
      {
        id: '1876',
        pid: '187',
        type: 'input',
        name: '单行文本4',
        icon: 'icon-input'
      }
    ]
  }
];

function empty(pid) {
  return {
    id: Math.random()
      .toString(16)
      .slice(2),
    name: 'empty',
    pid,
    type: '__empty__'
  };
}

function rawData2KeyPos(rawList) {
  const keyPos = {};
  function loop(data, pos) {
    data.forEach(({ id: key, elements }, index) => {
      keyPos[key] = [...(pos || []), index];
      if (elements && elements.length) loop(elements, keyPos[key]);
    });
  }

  loop(rawList);
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

const keyPositions = rawData2KeyPos(rawData);

console.log('keyPositions', keyPositions);

function Nested({ data }) {
  const [cards, setCards] = useState(rawData);
  const [keyPos, setKeyPos] = useState(keyPositions);
  //   treeData2KeyPos(treeData)

  const moveCard = useCallback(
    (dragCard, hoverCard) => {
      const dragPos = keyPos[dragCard.id];
      const hoverPos = keyPos[hoverCard.id];
      const dragParentIsGrid = cards[dragPos[0]].type === 'grid';
      const hoverParentIsGrid = cards[hoverPos[0]].type === 'grid';
      const hoverIsEmpty = hoverParentIsGrid && hoverCard.type === '__empty__';
      // const clone = { ...hoverCard };
      // const dragPid = dragCard.pid;

      // console.log('dragParentIsGrid', hoverCard);

      const dragCommand = buildCommand(dragPos, i => {
        // 如果父级是 grid 组件，drag 过去之后要补一个 empty 对象
        const needInsertEmpty = dragParentIsGrid && hoverIsEmpty;
        // const emptyCard = { ...hoverCard, pid: dragCard.pid };
        const emptyCard = empty(dragCard.pid);

        return {
          $splice: [[i, 1, ...(needInsertEmpty ? [emptyCard] : [])]]
          // $splice: [[i, 1]]
        };
      });
      const hoverCommand = buildCommand(hoverPos, i => {
        const newCard = { ...dragCard, pid: hoverCard.pid };
        // 如果父级是 grid 组件，hoverCard 是 empty 组件，
        // 则把该 empty 组件移除后再把 dragCard 插入该位置
        return {
          $splice: [[i, hoverIsEmpty ? 1 : 0, newCard]]
          // $splice: [[i, 0, newCard]]
        };
      });

      let nextCards = update(cards, dragCommand);
      nextCards = update(nextCards, hoverCommand);
      const nextKeyPos = rawData2KeyPos(nextCards);

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
        if (item.type === 'grid') {
          return (
            <GridWrapper
              key={item.id}
              {...{ index, data: item, moveCard }}
            ></GridWrapper>
          );
        }
      })}
    </>
  );
}

export default Nested;
