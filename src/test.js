var list = [
  { id: '0-0-0', pid: '0-0', text: '0-0-0' },
  { id: '0-0-0-1', pid: '0-0-0', text: '0-0-0-1' },

  { id: '0-0-0-0', pid: '0-0-0', text: '0-0-0-0' },
  { id: '0-0-0-2', pid: '0-0-0', text: '0-0-0-2' },
  { id: '0-0-1', pid: '0-0', text: '0-0-1' },
  { id: '0-0', pid: undefined, text: '0-0' },
  { id: '0-0-1-0', pid: '0-0-1', text: '0-0-1-0' },
  { id: '0-0-1-1', pid: '0-0-1', text: '0-0-1-1' },
  { id: '0-0-1-2', pid: '0-0-1', text: '0-0-1-2' }
];

var keyEntities = {
  '0': { id: '0', children: [], text: 'root' }
};

list
  .map(m => m)
  .forEach(m => {
    m.parent = m.pid ? list.find(p => p.id === m.pid) : keyEntities['0'];
    if (!m.pid) {
      keyEntities['0'].children.push(m);
    }

    m.children = list.filter(p => p.pid === m.id);
    keyEntities[m.id] = m;
  });

function data2Tree(source, data) {
  return data.map(item => {
    const children = source.filter(m => m.pid === item.id);
    const parent = source.find(m => m.id === item.pid);
    return {
      ...item,
      parent,
      children: data2Tree(source, children)
    };
  });
}

const treeData = data2Tree(list, list.filter(m => !m.pid));
console.log(treeData, keyEntities);

var dragId = '0-0-1-1';
var hoverId = '0-0-0-1';
var dragIndex = 1;
var hoverIndex = 1;

var dragNode = keyEntities[dragId];
var hoverNode = keyEntities[hoverId];

// 实现把 0-0-1-1 => 0-0-0-1 位置

// 从 drag 的 parent.children 中移除 drag;
dragNode.parent.children.splice(dragIndex, 1);
// 把 drag 插入 hover 中
hoverNode.parent.children.splice(hoverIndex, 0, dragNode);
dragNode.parent = hoverNode.parent;

console.log(keyEntities);
