import React, { useState, useCallback } from 'react';

import update from 'immutability-helper';
import { Button } from 'antd';
import GridWrapper from './GridWrapper';
import WidgetWrapper from './WidgetWrapper';

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
      { id: '12121212121', pid: '185', name: '__empty__', type: '__empty__' },
      {
        id: '1856',
        pid: '185',
        type: 'input',
        name: '单行文本2',
        icon: 'icon-input'
      }
    ]
  },

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
        type: '__empty__',
        name: '__empty__',
        icon: 'icon-input'
      },
      {
        id: '1874',
        pid: '187',
        type: 'input',
        name: '单行文本33'
        // icon: 'icon-input'
      },
      {
        id: '1876',
        pid: '187',
        type: 'input',
        name: '单行文本5',
        icon: 'icon-input'
      }
    ]
  },
  { id: '1857', type: 'input', name: '单行文本3', icon: 'icon-input' }
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

const keyPositions = rawData2KeyPos(rawData);

// console.log('keyPositions', updateData(d));

function Nested({ data }) {
  const [cards, setCards] = useState(rawData);
  const [keyPos, setKeyPos] = useState(keyPositions);
  const [selectMap, setSelectCard] = useState({});
  //   treeData2KeyPos(treeData)
  const switchCard = () => {
    // const dragParentCard = cards[0];
    // const hoverParentCard = cards[1];

    const dragCard = cards[0].elements[1];
    const hoverCard = cards[1].elements[1];

    const nextDragCard = {
      ...hoverCard,
      pid: dragCard.pid /*id: dragCard.id*/
    };
    const nextHoverCard = {
      ...dragCard,
      pid: hoverCard.pid /*id: hoverCard.id */
    };

    const nextCards = update(cards, {
      0: {
        elements: {
          // [2]: { $merge: { _hidden: true } },
          $splice: [[1, 1, nextDragCard]]
        }
      },
      1: {
        elements: {
          $splice: [[1, 1, nextHoverCard]]
        }
      }
    });

    // setCards(nextCards);
    const nextKeyPos = rawData2KeyPos(nextCards);

    setCards(nextCards);
    setKeyPos(nextKeyPos);
  };
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
      return ;
      // switchCard();
      // return;
      // console.log('dragCard|hoverCard', dragCard, hoverCard);
      const dragPos = keyPos[dragCard.id];
      const hoverPos = keyPos[hoverCard.id];
      const dragParentIsGrid = cards[dragPos[0]].type === 'grid';
      const hoverParentIsGrid = cards[hoverPos[0]].type === 'grid';
      const hoverIsEmpty = hoverParentIsGrid && hoverCard.type === '__empty__';

      // 注意：元素被 hover 时不能被删除，否则会报 Expected to find a valid target. 错误，

      const dragCommand = buildCommand(dragPos, i => {
        // 如果父级是 grid 组件，drag 过去之后要补一个 empty 对象
        const needInsertEmpty = dragParentIsGrid && hoverIsEmpty;
        const emptyCard = empty(dragCard.pid);
        return {
          $splice: [[i, 1, ...(needInsertEmpty ? [emptyCard] : [])]]
        };
      });

      const hoverCommand = buildCommand(hoverPos, i => {
        // 如果父级是 grid 组件，hoverCard 是 empty 组件，
        // 则把该 empty 组件移除后再把 dragCard 插入该位置
        const newCard = { ...dragCard, pid: hoverCard.pid };

        return {
          // 解决报 Expected to find a valid target. 错误的问题
          // 解决方法：hover 时先不删该对象，先隐藏起来，drop 后在统一删除
          ...(hoverIsEmpty ? { [i]: { $merge: { _hidden: true } } } : {}),
          $splice: [[i, 0, newCard]]
        };
      });

      console.log(
        'dragCommand',
        dragParentIsGrid,
        JSON.stringify(dragCommand),
        JSON.stringify(hoverCommand),
        dragPos,
        hoverCard
      );
      // return;

      const nextCards = update(update(cards, dragCommand), hoverCommand);
      // if (hoverIsEmpty) nextCards = update(nextCards, hoverCommand1);
      // nextCards = update(nextCards, hoverCommand);
      const nextKeyPos = rawData2KeyPos(nextCards);

      setCards(nextCards);
      setKeyPos(nextKeyPos);

      console.log('moveCard', { dragPos, hoverPos, nextKeyPos, nextCards });
    },
    [cards, keyPos]
  );

  // console.log('nextCardsnextCards', keyPos, cards);
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
      <div style={{ textAlign: 'center' }}>
        <Button
          type='primary'
          onClick={() => {
            switchCard();
          }}
        >
          SwitchCard
        </Button>
      </div>
    </>
  );
}

export default Nested;
