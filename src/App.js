import 'antd/dist/antd.css';

import React, { useState, useCallback, useEffect, useRef } from 'react';
// import ReactDOM from 'ReactDOM';
// import logo from './logo.svg';
import './App.css';
// import './App.less';
import update from 'immutability-helper';
import { Row, Col, Tabs, Icon } from 'antd';
import Tree from 'antd/lib/tree';

import HTML5Backend from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

// import DragSourceWrapper from './DragSourceWrapper';
import Example from './Example';
import Nested from './nested';
import Targets from './targets';

// const data = [
//   'Racing car sprays burning fuel into crowd.',
//   'Japanese princess to wed commoner.',
//   'Australian walks 100km after outback crash.',
//   'Man charged over missing wedding girl.',
//   'Los Angeles battles huge wildfires.'
// ];
const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
];

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

const _copyList = {
  source: new Array(8).fill(0).map(() => {
    const id = newId();
    return {
      id,
      text: id,
      type: 'source'
    };
  }),
  dest: new Array(0).fill(0).map(() => {
    const id = newId();
    return {
      id,
      text: id,
      type: 'dest'
    };
  })
};

function App() {
  const [cards, setCards] = useState(data);
  const [copyList, setLists] = useState(_copyList);
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

      /**
       * 如果类型一样，则排序
       * 不一样则，一个删除，一个插入
       */

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
    },
    [cards]
  );

  const copyCard = useCallback(
    (dragIndex, hoverIndex, dragType, hoverType) => {
      const hoverCards = copyList[hoverType];
      const dragCards = copyList[dragType];
      const dragCard = dragCards[dragIndex];

      console.log(
        'copyCard',
        dragCard.id,
        dragType,
        hoverType,
        dragIndex,
        hoverIndex
      );

      if (dragIndex < 0 || hoverIndex < 0) return;

      /**
       * 只有 dragType === hoverType 和 dest => source 才会进入这里
       * 如果是 dragType === hoverType，则只排序 dest, source 无需排序
       * 如果是 dest => source, 因为在 card 中把两者的 type 设为了一样，
       * 所以要把 dragCard 的 type 改回 source，同时给 hoverCard 一个新的ID
       */

      setLists({
        ...copyList,
        ...(dragType === hoverType
          ? {
              ...(hoverType === 'dest'
                ? {
                    [dragType]: update(dragCards, {
                      $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
                    })
                  }
                : {})
            }
          : {
              [dragType]: update(dragCards, {
                [dragIndex]: o => ({ ...o, type: 'source' })
              }),
              ...(hoverType === 'dest'
                ? {
                    [hoverType]: update(hoverCards, {
                      $splice: [
                        [
                          hoverIndex,
                          0,
                          { ...dragCard, id: newId(), type: hoverType }
                        ]
                      ]
                    })
                  }
                : {})
            })
      });
    },
    [copyList]
  );

  // console.log('cards', cards[1]);

  return (
    <>
      {/* <Form /> */}
      <DndProvider backend={HTML5Backend}>
        <div className='app' style={{ margin: '24px auto', maxWidth: 900 }}>
          <Tabs defaultActiveKey='Targets'>
            <Tabs.TabPane tab='Two Lists' key='1'>
              <Row gutter={16} style={{ marginLeft: '0', marginRight: 0 }}>
                <Col md={6}>
                  <Example cards={cards} moveCard={moveCard} type={1} />
                </Col>
                <Col md={6}>
                  <Example cards={cards} moveCard={moveCard} type={2} />
                </Col>
                <Col md={6}>
                  <pre>{JSON.stringify(cards[1], null, 2)}</pre>
                </Col>
                <Col md={6}>
                  <pre>{JSON.stringify(cards[2], null, 1)}</pre>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Clone' key='2'>
              <Row gutter={2}>
                <Col md={6}>
                  <Example
                    cards={copyList}
                    moveCard={copyCard}
                    type={'source'}
                  />
                </Col>
                <Col md={6}>
                  <Example cards={copyList} moveCard={copyCard} type={'dest'} />
                </Col>
                <Col md={6}>
                  <pre>{JSON.stringify(copyList['source'], null, 2)}</pre>
                </Col>
                <Col md={6}>
                  <pre>{JSON.stringify(copyList['dest'], null, 1)}</pre>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Nested' key='3'>
              <Nested className='grid-widget'>
                <Row gutter={2}>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                </Row>
              </Nested>
              {/* <div className='grid-widget selected'>
                <div className='grid-widget-drag'>
                  <Icon type='drag'></Icon>
                </div>
                <Row gutter={2}>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                </Row>
              </div> */}
            </Tabs.TabPane>
            <Tabs.TabPane tab='Targets' key='Targets'>
              <Targets className='grid-widget'>
                <Row gutter={2}>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                  <Col span={6}>
                    <div>Column</div>
                  </Col>
                </Row>
              </Targets>
            </Tabs.TabPane>
            <Tabs.TabPane tab='Tree' key={4}>
              <Tree
                showIcon
                defaultExpandAll
                defaultSelectedKeys={['0-0-0']}
                treeData={treeData}
                // switcherIcon={<Icon type="down" />}
              ></Tree>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </DndProvider>
    </>
  );
}

export default App;
