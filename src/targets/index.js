import React, { useState, useCallback } from 'react';

import update from 'immutability-helper';
// import { Button } from 'antd';
import GridWrapper from './GridWrapper';
import WidgetWrapper from './WidgetWrapper';
import Card from './Card';

const EMPTY = '__empty__';

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
      { id: '12121212121', pid: '185', name: EMPTY, type: EMPTY },
      {
        id: '1856',
        pid: '185',
        type: 'input',
        name: '单行文本2',
        icon: 'icon-input',
        options: [{}]
      }
    ]
  },
  { id: '1857', type: 'input', name: '单行文本3', icon: 'icon-input' },
  {
    id: '187',
    type: 'grid',
    name: '栅格布局',
    icon: 'icon-grid-',
    cols: 3,
    elements: [
      {
        id: '1855',
        pid: '187',
        type: EMPTY,
        name: EMPTY,
        icon: 'icon-input'
      },
      { id: '1874', pid: '187', type: 'input', name: '单行文本33' },
      {
        id: '1876',
        pid: '187',
        type: 'input',
        name: '单行文本5',
        icon: 'icon-input'
      }
    ]
  }
];

const newId = () => {
  return Math.random()
    .toString(16)
    .slice(2);
};

function createEemptyCard(pid) {
  return {
    id: newId(),
    name: 'empty',
    type: EMPTY,
    pid
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

function updateData(rawList) {
  return rawList
    .filter(m => !m._hidden)
    .map(({ elements, ...item }) => {
      // const {elements}
      return {
        ...item,
        elements: elements ? updateData(elements) : []
      };
    });
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

function checkIsSameParent(from, to) {
  if (from.length !== to.length) return false;
  if (from.length === to.length && from.length === 1) return true;

  const arr1 = from.slice(0, -1);
  const arr2 = to.slice(0, -1);
  let parentIsSame = true;
  for (let i = 0; i < arr1.length; i++) {
    // console.log('item');
    if (arr1[i] !== arr2[i]) {
      parentIsSame = false;
      break;
    }
  }

  return parentIsSame;
}

const keyPositions = rawData2KeyPos(rawData);

// console.log('keyPositions', updateData(d));

function Targets({ data }) {
  const [cards, setCards] = useState(rawData);
  const [keyPos, setKeyPos] = useState(keyPositions);
  const [selectMap, setSelectCard] = useState({});
  //   treeData2KeyPos(treeData)

  const selectCard = id => {
    setSelectCard(prev => ({ [id]: !prev[id] }));
  };

  //  更新卡片—— 移除 带有 _hidden 的项
  const updateCard = () => {
    const nextCards = updateData(cards);
    const nextKeyPos = rawData2KeyPos(nextCards);
    setCards(nextCards);
    setKeyPos(nextKeyPos);
  };

  const moveCard = useCallback(
    (dragCard, hoverCard) => {
      // switchCard();
      // return;
      // console.log('dragCard|hoverCard', dragCard, hoverCard);

      const dragPos = keyPos[dragCard.id] || [cards.length];
      const hoverPos = keyPos[hoverCard.id];
      const dragParent = cards[dragPos[0]] || {};
      const hoverParent = cards[hoverPos[0]] || {};
      const dragIsGridCell =
        dragParent.type === 'grid' && dragCard.type !== 'grid';
      const hoverIsGridCell =
        hoverParent.type === 'grid' && hoverCard.type !== 'grid';
      const hoverIsEmptyCell = hoverIsGridCell && hoverCard.type === EMPTY;
      const isSameParent = checkIsSameParent(dragPos, hoverPos);

      let command = [];
      const dragCommand = buildCommand(dragPos, i => {
        // 如果 drag 对象是 grid cell 对象，则移除之后,没有填充对象，则填充 empty 对象;
        // 没有填充对象的情况:1、hover 对象是一个 empty cell; 2、从 cell 移出
        const needInsertEmptyCell =
          dragIsGridCell && (hoverIsEmptyCell || !hoverIsGridCell);
        const emptyCard = createEemptyCard(dragCard.pid);
        command = [i, 1, ...(needInsertEmptyCell ? [emptyCard] : [])];

        return { $splice: [command] };
      });

      const hoverCommand = buildCommand(hoverPos, i => {
        // 如果 hover 对象是 grid cell 对象，
        // 则把该 empty 组件移除后再把 dragCard 插入该位置
        const newCard = { ...dragCard, pid: hoverCard.pid };
        // console.log('isSameParent', isSameParent, hoverIsEmpty);
        return {
          $splice: [
            ...(isSameParent ? [command] : []),
            [i, hoverIsEmptyCell ? 1 : 0, newCard]
          ]
        };
      });

      console.log(
        'dragCommand',
        // dragParentIsGrid,
        JSON.stringify(dragCommand),
        JSON.stringify(hoverCommand),
        { merge: JSON.stringify({ ...dragCommand, ...hoverCommand }) },

        dragPos,
        hoverCard
      );
      // return;

      const nextCards = update(cards, { ...dragCommand, ...hoverCommand });
      // const nextCards = update(
      //   update(cards, dragCommand),
      //   hoverCommand
      // );
      // if (hoverIsEmpty) nextCards = update(nextCards, hoverCommand1);
      // nextCards = update(nextCards, hoverCommand);
      const nextKeyPos = rawData2KeyPos(nextCards);

      setCards(nextCards);
      setKeyPos(nextKeyPos);

      console.log('moveCard', { dragPos, hoverPos, nextKeyPos, nextCards });
    },
    [cards, keyPos]
  );

  console.log('nextCardsnextCards', keyPos, cards);
  return (
    <>
      {cards.map((item, index) => {
        if (item.type === 'grid') {
          return (
            <GridWrapper
              key={item.id}
              {...{
                index,
                data: item,
                moveCard,
                updateCard,
                selectMap,
                selectCard
              }}
            ></GridWrapper>
          );
        }
        return (
          <WidgetWrapper
            key={item.id}
            {...{
              index,
              data: item,
              moveCard,
              updateCard,
              selectMap,
              selectCard
            }}
          ></WidgetWrapper>
        );
      })}
      <div className='btn-list'>
        <Card
          data={{ ...createEemptyCard(), type: 'input', name: '单行文本' }}
        />
        {/* <Button
          type='primary'
          onClick={() => {
            // switchCard();
            test_cell_move_to_cell();
          }}
        >
          test_cell_move_to_cell
        </Button>
        <Button
          type='primary'
          onClick={() => {
            // switchCard();
            test_cell_move_to_cell1();
          }}
        >
          test_cell_move_to_cell1
        </Button>
        <Button
          type='primary'
          onClick={() => {
            // switchCard();
            test_cell_move_out();
          }}
        >
          test_cell_move_out
        </Button>
        <Button
          type='primary'
          onClick={() => {
            // switchCard();
            test_move_in_cell();
          }}
        >
          test_move_in_cell
        </Button> */}
      </div>
    </>
  );
}

export default Targets;
