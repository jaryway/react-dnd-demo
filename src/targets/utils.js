// import DragTypes from '../DragTypes';

//
export function canDrop(dragItem, data) {
  const { data: dragData } = dragItem;

  if (['grid'].includes(dragData.type)) return false;
  const isEmpty = data.type === '__empty__';
  // 如果当前是 empty 组件，则可以放入任意组件
  if (isEmpty) return true;
  // 否则必须要 pid 相等，即 同级内调换位置
  return data.pid === dragItem.data.pid;
}

// export function canDrop(dragItem, data) {
//   if (['grid'].includes(dragItem.data.type)) return false;
//   const isEmpty = data.type === '__empty__';
//   // 如果当前是 empty 组件，则可以放入任意组件
//   if (isEmpty) return true;
//   // 否则必须要 pid 相等，即 同级内调换位置
//   return data.pid === dragItem.data.pid;
// }

// const switchCard = () => {
//   // const dragParentCard = cards[0];
//   // const hoverParentCard = cards[1];

//   const dragCard = cards[0].elements[1];
//   const hoverCard = cards[1].elements[1];

//   const nextDragCard = {
//     ...hoverCard,
//     pid: dragCard.pid /*id: dragCard.id*/
//   };
//   const nextHoverCard = {
//     ...dragCard,
//     pid: hoverCard.pid /*id: hoverCard.id */
//   };

//   const nextCards = update(cards, {
//     0: {
//       elements: {
//         // [2]: { $merge: { _hidden: true } },
//         $splice: [[1, 1, nextDragCard]]
//       }
//     },
//     1: {
//       elements: {
//         $splice: [[1, 1, nextHoverCard]]
//       }
//     }
//   });

//   // setCards(nextCards);
//   const nextKeyPos = rawData2KeyPos(nextCards);

//   setCards(nextCards);
//   setKeyPos(nextKeyPos);
// };

// const test_cell_move_to_cell = () => {
//   const dragCard = cards[0].elements[0];
//   const hoverCard = cards[2].elements[0];
//   const newCard = { ...dragCard, pid: hoverCard.pid };

//   const nextCards = update(cards, {
//     0: { elements: { $splice: [[0, 1, createEemptyCard(dragCard.pid)]] } },
//     2: { elements: { $splice: [[0, 1, newCard]] } }
//   });

//   const nextKeyPos = rawData2KeyPos(nextCards);
//   setCards(nextCards);
//   setKeyPos(nextKeyPos);
// };
// const test_cell_move_to_cell1 = () => {
//   const dragCard = cards[2].elements[2];
//   const hoverCard = cards[2].elements[1];
//   const newCard = { ...dragCard, pid: hoverCard.pid };

//   const nextCards = update(cards, {
//     2: { elements: { $splice: [[2, 1], [1, 0, newCard]] } }
//   });

//   const nextKeyPos = rawData2KeyPos(nextCards);
//   setCards(nextCards);
//   setKeyPos(nextKeyPos);
// };

// const test_cell_move_out = () => {
//   const dragCard = cards[0].elements[0];
//   const hoverCard = cards[1];
//   const newCard = { ...dragCard, pid: hoverCard.pid };

//   const nextCards = update(cards, {
//     0: { elements: { $splice: [[0, 1, createEemptyCard(dragCard.pid)]] } },
//     $splice: [[1, 0, newCard]]
//   });

//   const nextKeyPos = rawData2KeyPos(nextCards);
//   setCards(nextCards);
//   setKeyPos(nextKeyPos);
// };

// const test_move_in_cell = () => {
//   const dragCard = cards[1];
//   const hoverCard = cards[0].elements[1];
//   const newCard = { ...dragCard, pid: hoverCard.pid };

//   const nextCards = update(cards, {
//     $splice: [[1, 1]],
//     0: { elements: { $splice: [[1, 1, newCard]] } }
//   });

//   const nextKeyPos = rawData2KeyPos(nextCards);
//   setCards(nextCards);
//   setKeyPos(nextKeyPos);
// };
